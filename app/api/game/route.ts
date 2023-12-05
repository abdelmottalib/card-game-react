import axios from "axios";
import { NextResponse } from "next/server";
const DECK_API_BASE_URL = "https://deckofcardsapi.com/api/deck";

// Create a new deck and shuffle it
export async function createAndShuffleDeck() {
  const createDeckResponse = await axios.get(
    `${DECK_API_BASE_URL}/new/shuffle/?deck_count=1`
  );
  const deckId = createDeckResponse.data.deck_id;

  return deckId;
}

// Draw a specified number of cards from the deck
export async function drawCards(deckId: string, count: number) {
  const drawCardResponse = await axios.get(
    `${DECK_API_BASE_URL}/${deckId}/draw/?count=${count}`
  );
  const drawnCards = drawCardResponse.data.cards;

  return drawnCards;
}
export default async function GET() {
  try {
    const deckId = await createAndShuffleDeck();
    const drawnCards = await drawCards(deckId, 10); // Change 10 to the desired number of pairs

    // Duplicate the cards to create matching pairs
    const duplicatedCards = [...drawnCards, ...drawnCards];

    // Shuffle the duplicated cards
    const shuffledCards = duplicatedCards.sort(() => Math.random() - 0.5);
    console.log(shuffledCards);
    return NextResponse.json(shuffledCards);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.error();
  }
}
