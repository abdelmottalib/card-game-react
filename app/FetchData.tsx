import { useEffect, useState } from "react";
import axios from "axios";
interface Card {
  code: string;
  image: string;
  hidden: boolean;
}
const HomePage = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/dog");

        if (response.status === 200) {
          const modifiedCards = response.data.map((card: Card) => ({
            ...card,
            hidden: true,
          }));
          setCards(modifiedCards);
        } else {
          console.error("Error fetching cards:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const doubleCard = (code: string, newCards: string[]) => {
    return newCards.filter((cardCode) => cardCode === code).length === 2;
  };
  const handleCardClick = (card: Card) => {
    if (flippedCards.length < 2) {
      setFlippedCards([...flippedCards, card.code]);

      const newCards = [...flippedCards, card.code];

      if (doubleCard(card.code, newCards)) {
        setCards((prevCards) =>
          prevCards.map((mappedCard: Card) =>
            mappedCard.code === card.code
              ? { ...mappedCard, hidden: false }
              : mappedCard
          )
        );
      }

      card.hidden = false;

      const intervalId = setInterval(() => {
        card.hidden = true;
        setFlippedCards((prevFlippedCards) =>
          prevFlippedCards.filter((code) => code !== card.code)
        );
        clearInterval(intervalId);
      }, 2000);
    }
  };
  return (
    <div className="h-screen mx-auto flex flex-col items-center justify-center w-[500px]">
      <h1 className="text-4xl font-bold mb-6">Memory Card Game</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Array.isArray(cards) &&
          cards.map((card: Card, index: number) => (
            <div
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
            </div>
          ))}
      </div>
    </div>
  );
};

export default HomePage;
