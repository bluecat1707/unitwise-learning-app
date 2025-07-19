import React, { useEffect, useState } from 'react';
// import Confetti from 'react-confetti'; // You'll need to install this: npm install react-confetti

interface ScoreDisplayProps {
  score: number; // Percentage score (0-100)
  totalQuestions: number;
  correctAnswers: number;
  onRetakeQuiz: () => void;
  isPerfectScore: boolean;
  showResults: boolean;
  mcqs: { id: string; question: string; options: string[]; correctAnswer: string }[];
  userAnswers: { [key: string]: string | null };
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  totalQuestions,
  correctAnswers,
  onRetakeQuiz,
  isPerfectScore,
  showResults,
  mcqs,
  userAnswers,
}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isPerfectScore) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000); // Stop confetti after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [isPerfectScore]);

  const scoreColorClass = isPerfectScore ? 'text-green-500' : (score > 0 ? 'text-yellow-500' : 'text-red-500');
  const scoreEmoji = isPerfectScore ? '🏅' : (score > 0 ? '👍' : '👎');

  return (
    <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg animate-fadeIn">
      {showConfetti && (
        // <Confetti
        //   width={window.innerWidth}
        //   height={window.innerHeight}
        //   recycle={false}
        //   numberOfPieces={200}
        // />
        <div className="absolute inset-0 flex items-center justify-center text-6xl z-50 pointer-events-none">
          🎉
        </div>
      )}
      <h2 className="text-3xl font-bold text-center mb-4">Quiz Result</h2>
      <div className="text-center mb-6">
        <p className={`text-6xl font-extrabold ${scoreColorClass} mb-2`}>
          {score}% {scoreEmoji}
        </p>
        <p className="text-xl text-gray-700 dark:text-gray-300">
          You got {correctAnswers} out of {totalQuestions} questions correct.
        </p>
      </div>

      {!isPerfectScore && (
        <div className="text-center mb-6">
          <button
            onClick={onRetakeQuiz}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg shadow-md hover:bg-primary-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
          >
            Retake Quiz
          </button>
        </div>
      )}

      {showResults && (
        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-2xl font-semibold mb-4">Your Answers:</h3>
          {mcqs.map((mcq, index) => {
            const userAnswer = userAnswers[mcq.id];
            const isCorrect = userAnswer === mcq.correctAnswer;
            const answerClass = isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';

            return (
              <div key={mcq.id} className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                <p className="font-medium text-lg mb-2">
                  {index + 1}. {mcq.question}
                </p>
                <p className={`font-semibold ${answerClass}`}>
                  Your Answer: {userAnswer || 'Not answered'} {isCorrect ? '✅' : '❌'}
                </p>
                {!isCorrect && (
                  <p className="font-semibold text-green-600 dark:text-green-400 mt-1">
                    Correct Answer: {mcq.correctAnswer}
                  </p>
                )}
                {mcq.explanation && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Explanation: {mcq.explanation}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ScoreDisplay;
