import React, { useState, useEffect } from 'react';
import UnitCard from './UnitCard';
import { units } from '../data/units';
import useLocalStorage from '../hooks/useLocalStorage';
import { UserProgress, UnitStatus } from '../types';

interface DashboardProps {
  onSelectUnit: (unitId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectUnit }) => {
  const [userProgress, setUserProgress] = useLocalStorage<UserProgress>('userProgress', {});
  const [darkMode, setDarkMode] = useLocalStorage<boolean>('darkMode', false);

  useEffect(() => {
    // Initialize user progress for new users or new units
    const initialProgress: UserProgress = {};
    units.forEach((unit, index) => {
      const currentUnitProgress = userProgress[unit.id];
      if (currentUnitProgress) {
        initialProgress[unit.id] = currentUnitProgress;
      } else {
        initialProgress[unit.id] = {
          status: index === 0 ? 'unlocked' : 'locked', // First unit is always unlocked
          bestScore: 0,
          perfectScoreAchieved: false,
        };
      }
    });
    setUserProgress(initialProgress);

    // Apply dark mode class to HTML element
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [units, userProgress, setUserProgress, darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newMode;
    });
  };

  const getUnitStatus = (unitId: string, index: number): UnitStatus => {
    const progress = userProgress[unitId];
    if (!progress) {
      return index === 0 ? 'unlocked' : 'locked'; // Default for uninitialized
    }

    if (progress.perfectScoreAchieved) {
      return 'completed';
    }

    // Check if previous unit is completed for unlocking
    if (index > 0) {
      const prevUnitId = units[index - 1].id;
      if (userProgress[prevUnitId]?.perfectScoreAchieved) {
        return 'unlocked';
      } else {
        return 'locked';
      }
    }
    return 'unlocked'; // First unit
  };

  const totalUnits = units.length;
  const completedUnits = Object.values(userProgress).filter(
    (progress) => progress.perfectScoreAchieved
  ).length;
  const progressPercentage = (completedUnits / totalUnits) * 100;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-primary-700 dark:text-primary-300">
          Learning Dashboard
        </h1>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
          title="Toggle Dark Mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Your Progress</h2>
        <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
          <div
            className="bg-primary-600 h-4 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-right text-sm text-gray-600 dark:text-gray-300 mt-2">
          {completedUnits}/{totalUnits} units completed ({progressPercentage.toFixed(0)}%)
        </p>
      </div>

      {/* Unit Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {units.map((unit, index) => {
          const status = getUnitStatus(unit.id, index);
          const unitProgress = userProgress[unit.id] || { bestScore: 0, perfectScoreAchieved: false };

          return (
            <UnitCard
              key={unit.id}
              unitId={unit.id}
              unitName={unit.name}
              status={status}
              bestScore={unitProgress.bestScore}
              perfectScoreAchieved={unitProgress.perfectScoreAchieved}
              onClick={onSelectUnit}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
