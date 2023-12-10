import React from 'react';
import { motion } from 'framer-motion';

interface GameControlsProps {
  clickableButtons: boolean;
  setInitialReveal: React.Dispatch<React.SetStateAction<boolean>>;
  setMoves: React.Dispatch<React.SetStateAction<number>>;
  setShowConfetti: React.Dispatch<React.SetStateAction<boolean>>;
  setPlayButtonClicked: React.Dispatch<React.SetStateAction<boolean>>;
  moves: number;
}

const GameControls: React.FC<GameControlsProps> = ({
  clickableButtons,
  setInitialReveal,
  setMoves,
  setShowConfetti,
  setPlayButtonClicked,
  moves,
}) => (
  <motion.div
    className="mt-10 h-10 w-full rounded flex items-center "
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
);

export default GameControls;
