
export interface Card {
  code: string;
  image: string;
  index: number;
  hidden: boolean;
  matched: boolean;
}

export interface FlippedCard {
  code: string;
  index: number;
  matched?: number;
}