import React from 'react';
import { UnitStatus } from '../types';

interface UnitCardProps {
  unitName: string;
  unitId: string;
  status: UnitStatus;
  bestScore: number;
  perfectScoreAchieved: boolean;
  onClick: (unitId: string) => void;
}

const UnitCard: React.FC<UnitCardProps> = ({
  unitName,
  unitId,
  status,
  bestScore,
  perfectScoreAchieved,
  onClick,
}) => {
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';

  const cardClasses = `
    relative p-6 rounded-xl shadow-lg transition-all duration-300 transform
    ${isLocked
      ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-70'
      : 'bg-white dark:bg-gray-800 hover:shadow-xl hover:-translate-y-1 cursor-pointer'
    }
    ${isCompleted ? 'border-2 border-green-500 dark:border-green-400' : 'border border-gray-200 dark:border-gray-700'}
  `;

  const statusIcon = isCompleted ? '✅' : (isLocked ? '🔒' : '🔓');
  const scoreColor = perfectScoreAchieved ? 'text-green-600 dark:text-green-400' : 'text-primary-600 dark:text-primary-400';

  return (
    <div className={cardClasses} onClick={() => !isLocked && onClick(unitId)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">
          {unitName}
        </h3>
        <span className="text-2xl">{statusIcon}</span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
        Status: <span className="capitalize font-medium">{status}</span>
      </p>
      {status !== 'locked' && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Best Score: <span className={`font-bold ${scoreColor}`}>{bestScore}%</span>
          </p>
          {perfectScoreAchieved && (
            <span className="text-xl ml-2" title="Perfect Score Achieved">⭐</span>
          )}
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 bg-opacity-80 dark:bg-opacity-80 rounded-xl">
          <span className="text-lg font-bold text-gray-600 dark:text-gray-300">Locked</span>
        </div>
      )}
    </div>
  );
};

export default UnitCard;
