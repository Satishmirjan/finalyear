
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  STUDY_ROOM = 'STUDY_ROOM',
  QUIZ_SESSION = 'QUIZ_SESSION',
  TEACHER_TOOLS = 'TEACHER_TOOLS',
  PROGRESS = 'PROGRESS'
}

export interface Flashcard {
  question: string;
  answer: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LearningContent {
  id: string;
  title: string;
  summary: string;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  timestamp: number;
}

export interface TeacherSchedule {
  week: string;
  topic: string;
  objectives: string[];
  activities: string[];
}

export interface UserProgress {
  topic: string;
  score: number;
  totalQuestions: number;
  date: string;
}
