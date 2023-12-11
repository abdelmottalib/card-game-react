import axios from "axios";
import { Dispatch, SetStateAction } from "react";
const DECK_API_BASE_URL = "https://deckofcardsapi.com/api/deck";

// Create a new deck and shuffle it
export async function createAndShuffleDeck() {
  const createDeckResponse = await axios.get(
    `${DECK_API_BASE_URL}/new/shuffle/?deck_count=1`,
  );
  const deckId = createDeckResponse.data.deck_id;

  return deckId;
}

// Draw a specified number of cards from the deck
export async function drawCards(deckId: string, count: number) {
  const drawCardResponse = await axios.get(
    `${DECK_API_BASE_URL}/${deckId}/draw/?count=${count}`,
  );
  const drawnCards = drawCardResponse.data.cards;

  return drawnCards;
}
interface Difficulty {
  easy: boolean;
  medium: boolean;
  hard: boolean;
}
export const getCurrentShortestTime = (
  difficulty: Difficulty,
  shortestTimeEasy: number,
  shortestTimeMedium: number,
  shortestTimeHard: number,
) => {
  if (difficulty.easy) return shortestTimeEasy;
  else if (difficulty.medium) return shortestTimeMedium;
  else if (difficulty.hard) return shortestTimeHard;
};

export const setCurrentShortestTime = (
  time: number,
  difficulty: Difficulty,
  setShortestTimeEasy: Dispatch<SetStateAction<number>>,
  setShortestTimeMedium: Dispatch<SetStateAction<number>>,
  setShortestTimeHard: Dispatch<SetStateAction<number>>,
) => {
  if (difficulty.easy) return setShortestTimeEasy(time);
  else if (difficulty.medium) return setShortestTimeMedium(time);
  else if (difficulty.hard) return setShortestTimeHard(time);
};

export const setLocalStorageCurrentShortestTime = (
  time: number,
  difficulty: Difficulty,
) => {
  if (typeof window !== "undefined" && window.localStorage) {
    if (difficulty.easy)
      localStorage.setItem("shortestTimeEasy", time.toString());
    else if (difficulty.medium)
      localStorage.setItem("shortestTimeMedium", time.toString());
    else if (difficulty.hard)
      localStorage.setItem("shortestTimeHard", time.toString());
  }
};
export const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${hours > 0 ? `${hours}h ` : ""}${minutes}m ${remainingSeconds}s`;
};
export function delayAction(
  action: () => void,
  milliseconds: number,
): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      action();
      resolve();
    }, milliseconds);
  });
}
