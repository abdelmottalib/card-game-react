import { useState, useEffect } from 'react';
import { createAndShuffleDeck, drawCards } from './utils';
import { MdOutlineTimer } from 'react-icons/md';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';

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
function delayAction(action: () => void, milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      action();
      resolve();
    }, milliseconds);
  });
}

const HomePage = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<FlippedCard[]>([]);
  const [initialReveal, setInitialReveal] = useState<boolean>(true);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [moves, setMoves] = useState<number>(0);
  const [matchedCardsAnimation, setMatchedCardsAnimation] =
    useState<boolean>(false);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [playButtonClicked, setPlayButtonClicked] = useState<boolean>(false);
  const [placeHolder, setPlaceHolder] = useState(true);
  const [difficulty, setDifficulty] = useState({
    easy: true,
    medium: false,
    hard: false,
  });
  const [clickable, setClickable] = useState(false);
  const [clickableButtons, setClickableButtons] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!gameCompleted) setTime(0);
    const interval = setInterval(() => {
      if (gameStarted && !gameCompleted) {
        setTime((prevTime) => prevTime + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStarted, gameCompleted]);

  useEffect(() => {
    if (playButtonClicked) {
      setClickableButtons(false);
      const fetchData = async () => {
        try {
          const deckId = await createAndShuffleDeck();
          const count = difficulty.easy
            ? 10
            : difficulty.medium
            ? 16
            : difficulty.hard
            ? 20
            : 10;
          console.log(count);
          const drawnCards = await drawCards(deckId, count);
          setLoading(false);
          const duplicatedCards = [...drawnCards, ...drawnCards];
          const shuffledCards = duplicatedCards.sort(() => Math.random() - 0.5);
          const modifiedCards = shuffledCards.map(
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
              setPlaceHolder(false);
              setClickable(false);
            }, index * 100);
          });
          setCards(modifiedCards);
          setTimeout(
            () => {
              const promises = modifiedCards.map((card: Card, index: number) =>
                delayAction(() => {
                  setCards((prevCards) =>
                    prevCards.map((prevCard, prevIndex) =>
                      prevIndex === index
                        ? { ...prevCard, hidden: true }
                        : prevCard
                    )
                  );
                }, index * 100)
              );

              Promise.all(promises).then(() => {
                setClickable(true);
                setClickableButtons(true);
                setInitialReveal(false);
              });
            },
            difficulty.hard ? 8000 : 4000
          );
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
      setPlayButtonClicked(false);
      setGameStarted(false);
      setGameCompleted(false);
    }
  }, [playButtonClicked]);

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

    return `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${remainingSeconds}s`;
  };
  useEffect(() => console.log(clickable), [clickable]);
  const handleCardClick = (clickedCard: Card) => {
    if (!clickable) {
      return;
    }
    if (
      flippedCards.every(
        (card) => card.index !== clickedCard.index && clickedCard.hidden
      )
    ) {
      setMoves((prev) => prev + 1);
    }
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
  useEffect(() => {
    console.log(difficulty);
  }, [difficulty.easy]);
  return (
    <div
      className={`h-screen mx-auto flex flex-col items-center justify-center ${
        difficulty.easy
          ? 'w-[550px]'
          : // : difficulty.medium
            // ? "w-[950px]"
            'w-[1000px]'
      } text-white`}
    >
      <div className="flex gap-16 mb-5">
        <div className="flex items-center justify-around rounded border border-sky-200 bg-sky-700 w-36 h-10 ">
          <MdOutlineTimer />
          {formatTime(time)}
        </div>
        {/* <h1 className="text-2xl font-bold mb-6">Memory Card Game</h1> */}
        <div className="flex gap-2">
          <div
            className={`flex items-center justify-around rounded border border-emerald-200 bg-emerald-700 shadow-md px-5 h-10 cursor-pointer ${
              !clickableButtons ? 'opacity-50' : ''
            } `}
            onClick={() => {
              if (clickableButtons) {
                setDifficulty({ easy: true, medium: false, hard: false });
                setInitialReveal(true);
                setMoves(0);
                setShowConfetti(false);
                setPlayButtonClicked(true);
              }
            }}
          >
            easy
          </div>
          <div
            className={`flex items-center justify-around rounded border border-emerald-200 bg-emerald-700 shadow-md px-5 h-10 cursor-pointer ${
              !clickableButtons ? 'opacity-50' : ''
            } `}
            onClick={() => {
              if (clickableButtons) {
                setDifficulty({ easy: false, medium: true, hard: false });
                setInitialReveal(true);
                setMoves(0);
                setShowConfetti(false);
                setPlayButtonClicked(true);
              }
            }}
          >
            medium
          </div>
          <div
            className={`flex items-center justify-around rounded border border-emerald-200 bg-emerald-700 shadow-md px-5 h-10 cursor-pointer ${
              !clickableButtons ? 'opacity-50' : ''
            } `}
            onClick={() => {
              if (clickableButtons) {
                setDifficulty({ easy: false, medium: false, hard: true });
                setInitialReveal(true);
                setMoves(0);
                setShowConfetti(false);
                setPlayButtonClicked(true);
              }
            }}
          >
            hard
          </div>
        </div>
      </div>
      <div
        className={`grid ${
          difficulty.easy ? 'grid-cols-5' : 'grid-cols-8'
        } gap-4`}
      >
        {!loading
          ? Array.isArray(cards) &&
            cards.map((card: Card, index: number) => (
              <motion.div
                key={index}
                className={`relative aspect-w-2  aspect-h-3 border-2 border-gray-300 rounded-md overflow-hidden`}
                onClick={() => handleCardClick(card)}
                initial={{ rotateY: 0 }}
                animate={{
                  rotateY: card.hidden ? -180 : 0,
                  // boxShadow: matchedCardsAnimation
                  //   ? '0 0 20px #4CAF50'
                  //   : 'none',
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
                  className="object-cover w-20"
                />
              </motion.div>
            ))
          : Array.from(
              { length: difficulty.easy ? 20 : difficulty.medium ? 30 : 40 },
              (_, index) => (
                <motion.div
                  key={index}
                  className={`w-[88px] h-[120px] relative aspect-w-2 aspect-h-3 border-2 border-gray-300 rounded-md overflow-hidden `}
                  initial={{ rotate: 360 }}
                  animate={{ rotate: 0 }}
                >
                  <div className="absolute inset-0 bg-gray-800"></div>
                </motion.div>
              )
            )}
      </div>
      <motion.div
        className="mt-10  h-10 w-full rounded  flex items-center "
        onClick={() => {
          setInitialReveal(true);
          setMoves(0);
        }}
      >
        <div className="flex items-center justify-around w-full">
          <div className="flex items-center justify-around rounded border border-sky-200 bg-sky-700 shadow-md px-5 h-10 ">
            moves: {moves}
          </div>
          <motion.button
            className={`flex items-center justify-around rounded border border-emerald-200 bg-emerald-700 shadow-md px-5 h-10 ${
              !clickableButtons ? 'opacity-50' : ''
            } `}
            onClick={() => {
              if (clickableButtons) {
                setInitialReveal(true);
                setMoves(0);
                setShowConfetti(false);
                setPlayButtonClicked(true);
              }
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 1.2 }}
          >
            Play
          </motion.button>
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
