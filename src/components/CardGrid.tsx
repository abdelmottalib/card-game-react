import React from 'react';
import { motion } from 'framer-motion';
import CardComponent from './Card';
import { Card } from '../types';
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
  spinner: boolean;
}

const CardGrid: React.FC<CardGridProps> = ({
  difficulty,
  loading,
  cards,
  handleCardClick,
  matchedCardsAnimation,
  spinner,
}) => (
  <div
    className={`grid ${difficulty.easy ? 'grid-cols-5' : 'grid-cols-8'} gap-4 ${
      difficulty.easy
        ? 'w-[475px] h-[498px]'
        : difficulty.medium
        ? 'w-[780px] h-[505px]'
        : 'w-[780px] h-[635px]'
    }`}
  >
    {Array.isArray(cards) &&
      cards.map((card: Card, index: number) => (
        <CardComponent
          key={index}
          card={card}
          handleCardClick={handleCardClick}
          matchedCardsAnimation={matchedCardsAnimation}
        />
      ))}
    {loading &&
      !spinner &&
      Array.from(
        { length: difficulty.easy ? 20 : difficulty.medium ? 30 : 40 },
        (_, index) => (
          <motion.div
            key={index}
            className={`w-20 h-[110px] aspect-w-2 aspect-h-3 border-2 border-gray-300 rounded-md overflow-hidden bg-gray-800`}
            initial={{ rotate: 360 }}
            animate={{ rotate: 0 }}
          >
            {/* <div className="absolute inset-0 bg-gray-800"></div> */}
          </motion.div>
        )
      )}
    {spinner && (
      <div className="absolute inset-0 flex items-center justify-center">
        <img src={'spinner-laoding.svg'} alt="spinner" />
      </div>
    )}
  </div>
);

export default CardGrid;
