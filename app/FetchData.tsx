import { useState, useEffect } from 'react';
import {
  createAndShuffleDeck,
  drawCards,
  getCurrentShortestTime,
  setCurrentShortestTime,
  setLocalStorageCurrentShortestTime,
  formatTime,
} from './utils';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import GameHeader from './components/GameHeader';
import DifficultySelector from './components/DifficultySelector';
import CardGrid from './components/CardGrid';

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
  const [shortestTimeEasy, setShortestTimeEasy] = useState<number>(
    parseInt(localStorage.getItem('shortestTimeEasy') || '0', 10)
  );
  const [shortestTimeMedium, setShortestTimeMedium] = useState<number>(
    parseInt(localStorage.getItem('shortestTimeMedium') || '0', 10)
  );
  const [shortestTimeHard, setShortestTimeHard] = useState<number>(
    parseInt(localStorage.getItem('shortestTimeHard') || '0', 10)
  );

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
          //the glitch can be fixed with this need to have the component in position
          //absolute and use the use the timeout to avoid the glitch
          setTimeout(() => {});
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
      const currentShortestTime = getCurrentShortestTime(
        difficulty,
        shortestTimeEasy,
        shortestTimeMedium,
        shortestTimeHard
      );

      if (time < currentShortestTime! || currentShortestTime === 0) {
        setCurrentShortestTime(
          time,
          difficulty,
          setShortestTimeEasy,
          setShortestTimeMedium,
          setShortestTimeHard
        );
        setLocalStorageCurrentShortestTime(time, difficulty);
      }
    } else {
      setShowConfetti(false);
    }
  }, [cards, initialReveal]);

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
      <GameHeader
        shortestTimeEasy={shortestTimeEasy}
        shortestTimeMedium={shortestTimeMedium}
        shortestTimeHard={shortestTimeHard}
      />
      <DifficultySelector
        clickableButtons={clickableButtons}
        setDifficulty={setDifficulty}
        setInitialReveal={setInitialReveal}
        setMoves={setMoves}
        setShowConfetti={setShowConfetti}
        setPlayButtonClicked={setPlayButtonClicked}
        time={time}
      />
      <CardGrid
        difficulty={difficulty}
        loading={loading}
        cards={cards}
        handleCardClick={handleCardClick}
        matchedCardsAnimation={matchedCardsAnimation}
      />
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
