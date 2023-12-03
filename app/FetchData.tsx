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
}

const HomePage = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<FlippedCard[]>([]);
  const [initialReveal, setInitialReveal] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/dog");

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
          }, 2000);
        } else {
          console.error("Error fetching cards:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("cards in use effect", cards);
  }, [cards]);

  const handleCardClick = (clickedCard: Card) => {
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

    // Check for matching cards
    updatedFlippedCards.forEach((flippedCard) => {
      if (
        flippedCard.code === clickedCard.code &&
        flippedCard.index !== clickedCard.index
      ) {
        const isMatching = (x: Card) =>
          x.code === flippedCard.code
            ? { ...x, matched: true, hidden: false }
            : { ...x, matched: false, hidden: true };
  
        const matchedCards = cards.map(isMatching);
        setCards(matchedCards);
  
        console.log("matched cards", matchedCards);
      }
    });
  
    console.log("cards:", cards);
    setTimeout(() => {
      setFlippedCards([]);
      const modifiedCards = cards.map((x) => {
        if (!x.matched) {
          x.hidden = true;
        }
        return x;
      });
      setCards(modifiedCards);
    }, 2000);
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
            >
              {card.hidden && (
                <div className="absolute inset-0 bg-gray-800 opacity-80"></div>
              )}
              <img
                src={card.image}
                alt={card.code}
                className="object-cover w-full h-full"
              />
            </motion.div>
          ))}
      </div>
    </div>
  );
};

export default HomePage;
