import { useState, useEffect } from "react";
import { MdOutlineTimer } from "react-icons/md";
import axios from "axios";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { MdOutlineRestartAlt } from "react-icons/md";

interface Card {
  code: string;
  image: string;
  index: number;
  hidden: boolean;
  matched: boolean;
}
interface FlippedCard {
  code: string;
  index: number;
  matched?: number;
}

const HomePage = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<FlippedCard[]>([]);
  const [initialReveal, setInitialReveal] = useState<boolean>(true);
  const [refrech, setRefrech] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [moves, setMoves] = useState<number>(0);
  const [matchedCardsAnimation, setMatchedCardsAnimation] =
    useState<boolean>(false);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (!gameCompleted) setTime(0);
    const interval = setInterval(() => {
      if (gameStarted && !gameCompleted) {
        setTime((prevTime) => prevTime + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStarted, refrech, gameCompleted]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/game");

        if (response.status === 200) {
          const modifiedCards = response.data.map(
            (card: Card, index: number) => ({
              ...card,
              hidden: true,
              index: index,
            })
          );
          modifiedCards.forEach((card: Card, index: number) => {
            setTimeout(() => {
              setCards((prevCards) =>
                prevCards.map((prevCard, prevIndex) =>
                  prevIndex === index
                    ? { ...prevCard, hidden: false }
                    : prevCard
                )
              );
            }, index * 100);
          });
          setCards(modifiedCards);
          setTimeout(() => {
            modifiedCards.forEach((card: Card, index: number) => {
              setTimeout(() => {
                setCards((prevCards) =>
                  prevCards.map((prevCard, prevIndex) =>
                    prevIndex === index
                      ? { ...prevCard, hidden: true }
                      : prevCard
                  )
                );
              }, index * 100);
              setInitialReveal(false);
            });
          },  4000);
          // setTimeout(() => {
          //   setCards((prevCards) =>
          //     prevCards.map((card) => ({ ...card, hidden: true }))
          //   );
          //   setInitialReveal(false);
          // }, 4500);
        } else {
          console.error("Error fetching cards:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    setGameStarted(false);
    setGameCompleted(false);
  }, [refrech]);

  useEffect(() => {
    if (cards.every((card) => !card.hidden) && !initialReveal) {
      setShowConfetti(true);
      setGameCompleted(true);
    } else {
      setShowConfetti(false);
    }
  }, [cards, initialReveal]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours > 0 ? `${hours}h ` : ""}${minutes}m ${remainingSeconds}s`;
  };

  const handleCardClick = (clickedCard: Card) => {
    setMoves((prev) => prev + 1);
    if (!gameStarted) {
      setGameStarted(true);
    }

    if (flippedCards.length === 2) {
      return;
    }

    const updatedCards = cards.map((card) =>
      card.index === clickedCard.index ? { ...card, hidden: false } : card
    );
    setCards(updatedCards);

    const updatedFlippedCards = [
      ...flippedCards,
      { code: clickedCard.code, index: clickedCard.index },
    ];
    setFlippedCards(updatedFlippedCards);

    if (updatedFlippedCards.length === 2) {
      if (
        updatedFlippedCards[0].code === updatedFlippedCards[1].code &&
        updatedFlippedCards[0].index !== updatedFlippedCards[1].index
      ) {
        setMatchedCardsAnimation(true);

        setTimeout(() => {
          setFlippedCards([]);
          setMatchedCardsAnimation(false);
          const updatedMatchedCards = updatedCards.map((card) =>
            card.index === updatedFlippedCards[0].index ||
            card.index === updatedFlippedCards[1].index
              ? { ...card, matched: true }
              : card
          );
          setCards(updatedMatchedCards);
        }, 1000);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
          const modifiedCards = updatedCards.map((card) =>
            !card.matched ? { ...card, hidden: true } : card
          );
          setCards(modifiedCards);
        }, 1500);
      }
    }
  };

  return (
    <div className="h-screen mx-auto flex flex-col items-center justify-center w-[500px] text-white">
      <div className="flex gap-16 mb-5">
        <div className="flex items-center justify-around rounded border border-sky-200 bg-sky-700 w-36 h-10 ">
          <MdOutlineTimer />
          {formatTime(time)}
        </div>
        <h1 className="text-2xl font-bold mb-6">Memory Card Game</h1>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Array.isArray(cards) &&
          cards.map((card: Card, index: number) => (
            <motion.div
              key={index}
              className={`relative aspect-w-2 aspect-h-3 border-2 border-gray-300 rounded-md overflow-hidden`}
              onClick={() => handleCardClick(card)}
              initial={{ rotateY: 0 }}
              animate={{
                rotateY: card.hidden ? -180 : 0,
                boxShadow: matchedCardsAnimation ? "0 0 20px #4CAF50" : "none",
                opacity: matchedCardsAnimation ? 0.7 : 1,
              }}
              whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
              transition={{ duration: 0.5 }}
            >
              {card.hidden && (
                <div className="absolute inset-0 bg-gray-800"></div>
              )}
              <img
                src={card.image}
                alt={card.code}
                className="object-cover w-full h-full"
              />
            </motion.div>
          ))}
      </div>
      <motion.div
        className="mt-10  h-10 w-full rounded  flex items-center "
        onClick={() => {
          setInitialReveal(true);
          setRefrech(!refrech);
          setMoves(0);
        }}
      >
        <div className="flex items-center justify-around w-full">
          <div className="flex items-center justify-around rounded border border-sky-200 bg-sky-700 shadow-md px-5 h-10 ">
            moves: {moves}
          </div>
          <motion.div
            animate={{ rotate: refrech ? 360 : 0 }}
            transition={{ type: "tween", duration: 0.2 }}
            whileHover={{ scale: 1.4, transition: { duration: 0.2 } }}
          >
            <MdOutlineRestartAlt className="text-4xl text-white cursor-pointer" />
          </motion.div>
        </div>
      </motion.div>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={200}
        />
      )}
    </div>
  );
};

export default HomePage;