export interface MCQ {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string; // Optional explanation for correct answer
}

export interface Unit {
  id: string;
  name: string;
  mcqs: MCQ[];
}

export type UnitStatus = 'locked' | 'unlocked' | 'completed';

export interface UserProgress {
  [unitId: string]: {
    status: UnitStatus;
    bestScore: number; // Percentage score (0-100)
    perfectScoreAchieved: boolean;
  };
}
