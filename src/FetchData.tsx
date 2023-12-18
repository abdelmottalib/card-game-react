"use client";
import { useState, useEffect } from "react";
import {
  createAndShuffleDeck,
  drawCards,
  getCurrentShortestTime,
  setCurrentShortestTime,
  setLocalStorageCurrentShortestTime,
  delayAction,
  isLocalStorageAvailable,
} from "./utils";
import Confetti from "react-confetti";
import GameHeader from "./components/GameHeader";
import DifficultySelector from "./components/DifficultySelector";
import CardGrid from "./components/CardGrid";
import GameControls from "./components/GameControlls";
import { Card, FlippedCard } from "./types";

const HomePage = () => {
  // State to store the deck of cards for the game
  const [cards, setCards] = useState<Card[]>([]);

  // State to track flipped cards during the game
  const [flippedCards, setFlippedCards] = useState<FlippedCard[]>([]);
  //************************************************************** */

  // State to control the initial reveal animation
  const [initialReveal, setInitialReveal] = useState<boolean>(true);
  //************************************************************** */

  // State to toggle confetti animation when the game is completed
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  //************************************************************** */

  // State to track the elapsed time in seconds during the game
  const [time, setTime] = useState<number>(0);
  //************************************************************** */

  // State to indicate whether the game has started
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  //************************************************************** */

  // State to track the number of moves made by the player
  const [moves, setMoves] = useState<number>(0);
  //************************************************************** */

  // State to trigger animation when matched cards are found
  const [matchedCardsAnimation, setMatchedCardsAnimation] =
    useState<boolean>(false);
  //************************************************************** */

  // State to indicate whether the game has been completed
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  //************************************************************** */

  // State to handle the click event of the play button
  const [playButtonClicked, setPlayButtonClicked] = useState<boolean>(false);
  //************************************************************** */

  // State to control the animation of card flipping
  const [animation, setAnimation] = useState(true);
  //************************************************************** */

  // State to store the selected difficulty level
  const [difficulty, setDifficulty] = useState({
    easy: true,
    medium: false,
    hard: false,
  });
  //************************************************************** */

  // State to control whether cards are clickable
  const [clickable, setClickable] = useState(false);
  //************************************************************** */

  // State to control whether buttons are clickable (e.g., difficulty selection)
  const [clickableButtons, setClickableButtons] = useState(true);
  //************************************************************** */

  // State to indicate whether the game is in a loading state
  const [loading, setLoading] = useState(true);
  //************************************************************** */

  // State to control the visibility of a loading spinner
  const [spinner, setSpinner] = useState(false);
  //************************************************************** */

  // State to store the shortest completion time for the 'easy, medium, hard' difficulty
  const [shortestTimeEasy, setShortestTimeEasy] = useState<number>(
    isLocalStorageAvailable()
      ? parseInt(localStorage.getItem("shortestTimeEasy") || "0", 10)
      : 0,
  );
  const [shortestTimeMedium, setShortestTimeMedium] = useState<number>(
    isLocalStorageAvailable()
      ? parseInt(localStorage.getItem("shortestTimeMedium") || "0", 10)
      : 0,
  );
  const [shortestTimeHard, setShortestTimeHard] = useState<number>(
    isLocalStorageAvailable()
      ? parseInt(localStorage.getItem("shortestTimeHard") || "0", 10)
      : 0,
  );
  //************************************************************** */

  // Effect hook for updating time every second
  useEffect(() => {
    if (!gameCompleted) setTime(0);
    const interval = setInterval(() => {
      if (gameStarted && !gameCompleted) {
        setTime((prevTime: number) => prevTime + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStarted, gameCompleted]);
  /***************************************************************** */

  // Effect hook for handling play button click
  useEffect(() => {
    if (playButtonClicked) {
      setAnimation(true);
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
          const drawnCards = await drawCards(deckId, count);
          setCards([]);
          //the glitch can be fixed with this need to have the component in position
          //absolute and use the use the timeout to avoid the glitch
          setLoading(false);
          const duplicatedCards = [...drawnCards, ...drawnCards];
          const shuffledCards = duplicatedCards.sort(() => Math.random() - 0.5);
          const modifiedCards = shuffledCards.map(
            (card: Card, index: number) => ({
              ...card,
              hidden: true,
              index: index,
            }),
          );
          setSpinner(false);
          modifiedCards.forEach((card: Card, index: number) => {
            setTimeout(() => {
              console.log(card);
              setCards((prevCards: Card[]) =>
                prevCards.map((prevCard, prevIndex) =>
                  prevIndex === index
                    ? { ...prevCard, hidden: false }
                    : prevCard,
                ),
              );
              setClickable(false);
            }, index * 100);
          });
          setCards(modifiedCards);
          setTimeout(
            () => {
              const promises = modifiedCards.map((card: Card, index: number) =>
                delayAction(() => {
                  console.log(card);
                  setCards((prevCards: Card[]) =>
                    prevCards.map((prevCard, prevIndex) =>
                      prevIndex === index
                        ? { ...prevCard, hidden: true }
                        : prevCard,
                    ),
                  );
                  setAnimation(false);
                }, index * 100),
              );

              Promise.all(promises).then(() => {
                setClickable(true);
                setClickableButtons(true);
                setInitialReveal(false);
              });
            },
            difficulty.hard ? 8000 : 4000,
          );
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
      setPlayButtonClicked(false);
      setGameStarted(false);
      setGameCompleted(false);
    }
  }, [playButtonClicked]);
  /************************************************************ */

  // Effect hook for checking game completion and updating shortest time
  useEffect(() => {
    if (isLocalStorageAvailable()) {
      if (cards.every((card: Card) => !card.hidden) && !initialReveal) {
        setShowConfetti(true);
        setGameCompleted(true);
        const currentShortestTime = getCurrentShortestTime(
          difficulty,
          shortestTimeEasy,
          shortestTimeMedium,
          shortestTimeHard,
        );

        if (time < currentShortestTime! || currentShortestTime === 0) {
          setCurrentShortestTime(
            time,
            difficulty,
            setShortestTimeEasy,
            setShortestTimeMedium,
            setShortestTimeHard,
          );
          setLocalStorageCurrentShortestTime(time, difficulty);
        }
      } else {
        setShowConfetti(false);
      }
    }
  }, [cards, initialReveal]);
  /*********************************************************************** */

  // Function to handle card click
  const handleCardClick = (clickedCard: Card) => {
    if (!clickable) {
      return;
    }
    if (
      flippedCards.every(
        (card) => card.index !== clickedCard.index && clickedCard.hidden,
      )
    ) {
      setMoves((prev: number) => prev + 1);
    }
    if (!gameStarted) {
      setGameStarted(true);
    }

    if (flippedCards.length === 2) {
      return;
    }

    const updatedCards = cards.map((card: Card) =>
      card.index === clickedCard.index ? { ...card, hidden: false } : card,
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
          const updatedMatchedCards = updatedCards.map((card: Card) =>
            card.index === updatedFlippedCards[0].index ||
              card.index === updatedFlippedCards[1].index
              ? { ...card, matched: true }
              : card,
          );
          setCards(updatedMatchedCards);
        }, 1000);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
          const modifiedCards = updatedCards.map((card: Card) =>
            !card.matched ? { ...card, hidden: true } : card,
          );
          setCards(modifiedCards);
        }, 1500);
      }
    }
  };
  /****************************************************************** */

  return (
    <div
      className={`h-screen mx-auto flex flex-col items-center justify-center ${difficulty.easy
          ? "w-[550px]"
          : // : difficulty.medium
          // ? "w-[950px]"
          "w-[1000px]"
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
        setSpinner={setSpinner}
        setCards={setCards}
      />
      <CardGrid
        difficulty={difficulty}
        loading={loading}
        cards={cards}
        handleCardClick={handleCardClick}
        matchedCardsAnimation={matchedCardsAnimation}
        spinner={spinner}
        animation={animation}
      />
      <GameControls
        clickableButtons={clickableButtons}
        setInitialReveal={setInitialReveal}
        setMoves={setMoves}
        setShowConfetti={setShowConfetti}
        setPlayButtonClicked={setPlayButtonClicked}
        moves={moves}
        difficulty={difficulty}
      />

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
