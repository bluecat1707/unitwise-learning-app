import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Quiz from './components/Quiz';
import { units } from './data/units';
import useLocalStorage from './hooks/useLocalStorage';
import { UserProgress } from './types';

const App: React.FC = () => {
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useLocalStorage<UserProgress>('userProgress', {});

  const handleSelectUnit = (unitId: string) => {
    const unitIndex = units.findIndex(u => u.id === unitId);
    const currentUnitStatus = userProgress[unitId]?.status;

    // Allow selection only if unit is unlocked or completed
    if (currentUnitStatus === 'unlocked' || currentUnitStatus === 'completed' || unitIndex === 0) {
      setSelectedUnitId(unitId);
    } else {
      alert('This unit is locked. Please complete the previous unit with 100% score to unlock it.');
    }
  };

  const handleQuizComplete = (unitId: string, score: number, isPerfect: boolean) => {
    setUserProgress((prevProgress) => {
      const newProgress = { ...prevProgress };
      const currentUnitIndex = units.findIndex(u => u.id === unitId);

      // Update current unit's progress
      newProgress[unitId] = {
        ...newProgress[unitId],
        bestScore: Math.max(newProgress[unitId]?.bestScore || 0, score),
        perfectScoreAchieved: isPerfect || (newProgress[unitId]?.perfectScoreAchieved || false),
        status: isPerfect ? 'completed' : (newProgress[unitId]?.status || 'unlocked'), // Mark as completed if perfect
      };

      // Unlock next unit if current unit is perfect
      if (isPerfect && currentUnitIndex < units.length - 1) {
        const nextUnitId = units[currentUnitIndex + 1].id;
        if (newProgress[nextUnitId]?.status === 'locked' || !newProgress[nextUnitId]) {
          newProgress[nextUnitId] = {
            ...newProgress[nextUnitId],
            status: 'unlocked',
            bestScore: newProgress[nextUnitId]?.bestScore || 0,
            perfectScoreAchieved: newProgress[nextUnitId]?.perfectScoreAchieved || false,
          };
        }
      }
      return newProgress;
    });
  };

  const handleBackToDashboard = () => {
    setSelectedUnitId(null);
  };

  const currentUnit = selectedUnitId ? units.find((unit) => unit.id === selectedUnitId) : null;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary-800 dark:bg-primary-950 text-white p-4 shadow-md">
        <nav className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">UnitWise Learning</h1>
          {selectedUnitId && (
            <button
              onClick={handleBackToDashboard}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-md transition-colors duration-300"
            >
              ← Back to Dashboard
            </button>
          )}
        </nav>
      </header>

      <main className="flex-grow p-4">
        {selectedUnitId && currentUnit ? (
          <Quiz
            unitId={selectedUnitId}
            mcqs={currentUnit.mcqs}
            onQuizComplete={handleQuizComplete}
            onBackToDashboard={handleBackToDashboard}
          />
        ) : (
          <Dashboard onSelectUnit={handleSelectUnit} />
        )}
      </main>

      <footer className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 p-4 text-center text-sm">
        © {new Date().getFullYear()} UnitWise Learning Platform. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
