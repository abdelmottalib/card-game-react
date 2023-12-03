import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/game");

        if (response.status === 200) {
          const modifiedCards = response.data.map(
            (card: Card, index: number) => ({
              ...card,
              hidden: initialReveal ? false : true,
              index: index,
            })
          );
          console.log(modifiedCards);
          setCards(modifiedCards);
          setTimeout(() => {
            setCards((prevCards) =>
              prevCards.map((card) => ({ ...card, hidden: true }))
            );
            setInitialReveal(false); // Update the state to prevent further reveals
            setRefrech(false);
          }, 2000);
        } else {
          console.error("Error fetching cards:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [refrech]);

  useEffect(() => {
    console.log("cards in use effect", cards);
  }, [cards]);

  const handleCardClick = (clickedCard: Card) => {
    // Check if two cards are already flipped
    if (flippedCards.length === 2) {
      return; // Prevent selecting more than two cards at once
    }

    // Show the clicked card
    const updatedCards = cards.map((card) =>
      card.index === clickedCard.index ? { ...card, hidden: false } : card
    );
    setCards(updatedCards);

    // Add the flipped card to the flippedCards state
    const updatedFlippedCards = [
      ...flippedCards,
      { code: clickedCard.code, index: clickedCard.index },
    ];
    setFlippedCards(updatedFlippedCards);

    // Check if two cards are flipped
    if (updatedFlippedCards.length === 2) {
      // If the two cards match, mark them as matched
      if (
        updatedFlippedCards[0].code === updatedFlippedCards[1].code &&
        updatedFlippedCards[0].index !== updatedFlippedCards[1].index
      ) {
        const updatedMatchedCards = updatedCards.map((card) =>
          card.index === updatedFlippedCards[0].index ||
          card.index === updatedFlippedCards[1].index
            ? { ...card, matched: true }
            : card
        );
        setCards(updatedMatchedCards);
      }

      // Reset flipped cards after a delay
      setTimeout(() => {
        setFlippedCards([]);

        // If two cards didn't match, hide them
        if (
          updatedFlippedCards[0].code !== updatedFlippedCards[1].code ||
          updatedFlippedCards[0].index === updatedFlippedCards[1].index
        ) {
          const modifiedCards = updatedCards.map((card) =>
            !card.matched ? { ...card, hidden: true } : card
          );
          setCards(modifiedCards);
        }
      }, 2000);
    }
  };

  return (
    <div className="h-screen mx-auto flex flex-col items-center justify-center w-[500px]">
      <h1 className="text-4xl font-bold mb-6">Memory Card Game</h1>
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
              }}
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
      <motion.button
        className="mt-10 bg-slate-200 h-10 w-28 rounded text-black border border-gray-800"
        onClick={() => {
          setInitialReveal(true);
          setRefrech(true);
        }}
        animate={{ x: refrech ? 50 : 0}}
      >
        New Cards
      </motion.button>
    </div>
  );
};

export default HomePage;
