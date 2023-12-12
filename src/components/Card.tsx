import React from 'react';
import { motion } from 'framer-motion';

import { Card } from '../types';
interface CardComponentProps {
  card: Card;
  handleCardClick: (card: Card) => void;
  animation: boolean;
  matchedCardsAnimation: boolean;
}

const CardComponent: React.FC<CardComponentProps> = ({
  card,
  handleCardClick,
  matchedCardsAnimation,
  animation,
}) => {
  console.log(animation);
  return (
    <motion.div
      className={`relative aspect-w-2 aspect-h-3 border-2 border-gray-300 rounded-md overflow-hidden cursor-pointer`}
      onClick={() => handleCardClick(card)}
      // initial={{ x: -1000, rotateY: 0 }} // Set initial x value to move from the left
      animate={{
        x: animation ? (card.hidden ? -2700 : 0) : 0,
        rotateY: card.hidden ? -180 : 0,
        opacity: matchedCardsAnimation ? 0.7 : 1,
      }}
      whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
      transition={{ duration: 0.5 }}
    >
      {card.hidden && <div className="absolute inset-0 bg-gray-800"></div>}
      <img src={card.image} alt={card.code} className="object-cover w-20" />
    </motion.div>
  );
};

export default CardComponent;
