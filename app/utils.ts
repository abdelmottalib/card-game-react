
import axios from "axios";
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