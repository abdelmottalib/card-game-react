import React from 'react';
import { formatTime } from '../utils';

const GameHeader = ({
  shortestTimeEasy,
  shortestTimeMedium,
  shortestTimeHard,
}: {
  shortestTimeEasy: number;
  shortestTimeMedium: number;
  shortestTimeHard: number;
}) => (
  <div className="mb-5 flex flex-col gap-5">
    <h1 className="mx-auto text-2xl">Shortest Time</h1>
    <div className="flex gap-5">
      <div className="bg-violet-800 border border-violet-200 p-2 rounded">
        Easy: {formatTime(shortestTimeEasy)}
      </div>
      <div className="bg-violet-800 border border-violet-200 p-2 rounded">
        Medium: {formatTime(shortestTimeMedium)}
      </div>
      <div className="bg-violet-800 border border-violet-200 p-2 rounded">
        Hard: {formatTime(shortestTimeHard)}
      </div>
    </div>
  </div>
);

export default GameHeader;
