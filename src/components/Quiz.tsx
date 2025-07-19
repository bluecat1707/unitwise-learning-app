import React, { useState } from 'react';
import { MCQ } from '../types';
import ScoreDisplay from './ScoreDisplay';

interface QuizProps {
  unitId: string;
  mcqs: MCQ[];
  onQuizComplete: (unitId: string, score: number, isPerfect: boolean) => void;
  onBackToDashboard: () => void;
}

const Quiz: React.FC<QuizProps> = ({ unitId, mcqs, onQuizComplete, onBackToDashboard }) => {
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string | null }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isPerfectScore, setIsPerfectScore] = useState(false);

  const handleOptionChange = (mcqId: string, option: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [mcqId]: option,
    }));
  };

  const handleSubmit = () => {
    let correctAnswers = 0;
    mcqs.forEach((mcq) => {
      if (userAnswers[mcq.id] === mcq.correctAnswer) {
        correctAnswers++;
      }
    });

    const calculatedScore = (correctAnswers / mcqs.length) * 100;
    const perfect = calculatedScore === 100;

    setScore(calculatedScore);
    setCorrectCount(correctAnswers);
    setIsPerfectScore(perfect);
    setShowResults(true);
    onQuizComplete(unitId, calculatedScore, perfect);
  };

  const handleRetakeQuiz = () => {
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
    setCorrectCount(0);
    setIsPerfectScore(false);
  };

  const allAnswered = Object.keys(userAnswers).length === mcqs.length &&
                       mcqs.every(mcq => userAnswers[mcq.id] !== null);

  if (showResults) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl mt-8">
        <ScoreDisplay
          score={score}
          totalQuestions={mcqs.length}
          correctAnswers={correctCount}
          onRetakeQuiz={handleRetakeQuiz}
          isPerfectScore={isPerfectScore}
          showResults={true} // Always show detailed results after submission
          mcqs={mcqs}
          userAnswers={userAnswers}
        />
        <div className="text-center mt-6">
          <button
            onClick={onBackToDashboard}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg shadow-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl mt-8 animate-fadeIn">
      <h2 className="text-3xl font-bold text-center mb-6 text-primary-600 dark:text-primary-400">
        Unit {unitId.split('-')[1]} Quiz
      </h2>
      {mcqs.map((mcq, index) => (
        <div key={mcq.id} className="mb-8 p-5 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 animate-slideIn">
          <p className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            {index + 1}. {mcq.question}
          </p>
          <div className="space-y-3">
            {mcq.options.map((option) => (
              <label
                key={option}
                className="flex items-center p-3 rounded-md cursor-pointer transition-all duration-200
                           bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-gray-600
                           border border-gray-200 dark:border-gray-600
                           has-[:checked]:bg-primary-100 dark:has-[:checked]:bg-primary-800
                           has-[:checked]:border-primary-500 dark:has-[:checked]:border-primary-400"
              >
                <input
                  type="radio"
                  name={`mcq-${mcq.id}`}
                  value={option}
                  checked={userAnswers[mcq.id] === option}
                  onChange={() => handleOptionChange(mcq.id, option)}
                  className="form-radio h-5 w-5 text-primary-600 dark:text-primary-400 focus:ring-primary-500 dark:focus:ring-primary-400"
                />
                <span className="ml-3 text-gray-800 dark:text-gray-100">{option}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      <div className="mt-8 text-center">
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className={`px-8 py-4 text-lg font-semibold rounded-lg shadow-lg transition-all duration-300
                      ${allAnswered
                        ? 'bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                      }`}
        >
          Submit Answers
        </button>
      </div>
    </div>
  );
};

export default Quiz;
