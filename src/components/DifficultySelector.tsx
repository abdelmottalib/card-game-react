import React, { FC  } from 'react';
import { formatTime } from '../utils';
import { MdOutlineTimer } from 'react-icons/md';
import { Card } from '../types';

interface DifficultySelectorProps {
  clickableButtons: boolean;
  setDifficulty: React.Dispatch<
    React.SetStateAction<{ easy: boolean; medium: boolean; hard: boolean }>
  >;
  setInitialReveal: React.Dispatch<React.SetStateAction<boolean>>;
  setMoves: React.Dispatch<React.SetStateAction<number>>;
  setShowConfetti: React.Dispatch<React.SetStateAction<boolean>>;
  setPlayButtonClicked: React.Dispatch<React.SetStateAction<boolean>>;
  setSpinner: React.Dispatch<React.SetStateAction<boolean>>;
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
  time: number;
}

const DifficultySelector: FC<DifficultySelectorProps> = ({
  clickableButtons,
  setDifficulty,
  setInitialReveal,
  setMoves,
  setShowConfetti,
  setPlayButtonClicked,
  time,
  setSpinner,
  setCards,
}) => (
  <div className="flex gap-16 mb-5">
    <div className="flex items-center justify-around rounded border border-sky-200 bg-sky-700 w-36 h-10 ">
      <MdOutlineTimer />
      {formatTime(time)}
    </div>
    <div className="flex gap-2">
      <div
        className={`flex items-center justify-around rounded border border-emerald-200 bg-emerald-700 shadow-md px-5 h-10 cursor-pointer ${
          !clickableButtons ? 'opacity-50' : ''
        } `}
        onClick={() => {
          if (clickableButtons) {
            setDifficulty({ easy: true, medium: false, hard: false });
            setInitialReveal(true);
            setMoves(0);
            setShowConfetti(false);
            setPlayButtonClicked(true);
            setSpinner(true);
            setCards([]);
          }
        }}
      >
        easy
      </div>
      <div
        className={`flex items-center justify-around rounded border border-emerald-200 bg-emerald-700 shadow-md px-5 h-10 cursor-pointer ${
          !clickableButtons ? 'opacity-50' : ''
        } `}
        onClick={() => {
          if (clickableButtons) {
            setDifficulty({ easy: false, medium: true, hard: false });
            setInitialReveal(true);
            setMoves(0);
            setShowConfetti(false);
            setPlayButtonClicked(true);
            setSpinner(true);
            setCards([]);
          }
        }}
      >
        medium
      </div>
      <div
        className={`flex items-center justify-around rounded border border-emerald-200 bg-emerald-700 shadow-md px-5 h-10 cursor-pointer ${
          !clickableButtons ? 'opacity-50' : ''
        } `}
        onClick={() => {
          if (clickableButtons) {
            setDifficulty({ easy: false, medium: false, hard: true });
            setInitialReveal(true);
            setMoves(0);
            setShowConfetti(false);
            setPlayButtonClicked(true);
            setSpinner(true);
            setCards([]);
          }
        }}
      >
        hard
      </div>
    </div>
  </div>
);

export default DifficultySelector;
