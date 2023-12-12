import React from 'react';
import { motion } from 'framer-motion';

import { Card } from '../types';
interface CardComponentProps {
  card: Card;
  handleCardClick: (card: Card) => void;
  matchedCardsAnimation: boolean;
}

const CardComponent: React.FC<CardComponentProps> = ({
  card,
  handleCardClick,
  matchedCardsAnimation,
}) => (
  <motion.div
    className={`relative aspect-w-2 aspect-h-3 border-2 border-gray-300 rounded-md overflow-hidden cursor-pointer`}
    onClick={() => handleCardClick(card)}
    initial={{ rotateY: 0 }}
    animate={{
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

export default CardComponent;
