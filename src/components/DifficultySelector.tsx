import React, { FC } from "react";
import { formatTime } from "../utils";
import { MdOutlineTimer } from "react-icons/md";
import { Card } from "../types";
import DifficultySelectorChoice from "./DifficultySelectorChoice";

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
}) => {
  const onclick = (choice: string) => {
    if (clickableButtons) {
      if (choice === "easy") {
        setDifficulty({ easy: true, medium: false, hard: false });
      } else if (choice === "medium") {
        setDifficulty({ easy: false, medium: true, hard: false });
      } else {
        setDifficulty({ easy: false, medium: false, hard: true });
      }
      setInitialReveal(true);
      setMoves(0);
      setShowConfetti(false);
      setPlayButtonClicked(true);
      setSpinner(true);
      setCards([]);
    }
  };
  return (
    <section className="flex gap-16 mb-5">
      <div className="flex items-center justify-around rounded border border-sky-200 bg-sky-700 w-36 h-10 ">
        <MdOutlineTimer />
        {formatTime(time)}
      </div>
      <div className="flex gap-2">
        <DifficultySelectorChoice
          label="easy"
          onclick={onclick}
          clickableButtons={clickableButtons}
        />
        <DifficultySelectorChoice
          label="medium"
          onclick={onclick}
          clickableButtons={clickableButtons}
        />
        <DifficultySelectorChoice
          label="hard"
          onclick={onclick}
          clickableButtons={clickableButtons}
        />
      </div>
    </section>
  );
};

export default DifficultySelector;
