import React from 'react';
import { motion } from 'framer-motion';
import CardComponent from './Card';
interface Card {
  code: string;
  image: string;
  index: number;
  hidden: boolean;
  matched: boolean;
}
interface CardGridProps {
  difficulty: {
    easy: boolean;
    medium: boolean;
    hard: boolean;
  };
  loading: boolean;
  cards: Card[] | null;
  handleCardClick: (card: Card) => void;
  matchedCardsAnimation: boolean;
}

const CardGrid: React.FC<CardGridProps> = ({
  difficulty,
  loading,
  cards,
  handleCardClick,
  matchedCardsAnimation,
}) => (
  <div
    className={`grid ${difficulty.easy ? 'grid-cols-5' : 'grid-cols-8'} gap-4`}
  >
    {!loading
      ? Array.isArray(cards) &&
        cards.map((card: Card, index: number) => (
          <CardComponent
            key={index}
            card={card}
            handleCardClick={handleCardClick}
            matchedCardsAnimation={matchedCardsAnimation}
          />
        ))
      : Array.from(
          { length: difficulty.easy ? 20 : difficulty.medium ? 30 : 40 },
          (_, index) => (
            <motion.div
              key={index}
              className={`w-[88px] h-[120px] relative aspect-w-2 aspect-h-3 border-2 border-gray-300 rounded-md overflow-hidden`}
              initial={{ rotate: 360 }}
              animate={{ rotate: 0 }}
            >
              <div className="absolute inset-0 bg-gray-800"></div>
            </motion.div>
          )
        )}
  </div>
);

export default CardGrid;
