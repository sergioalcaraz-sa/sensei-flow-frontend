// src/types/index.ts

export interface TokenAnalysis {
  surface: string;
  reading: string;
  meaning: string;
  part_of_speech: string;
}

export interface AnalysisResponse {
  original_text: string;
  tokens: TokenAnalysis[];
  grammar_note?: string;
}

export interface HistoryRecord {
  id: string;
  original_text: string;
  tokens: TokenAnalysis[];
  grammar_note: string | null;
  created_at: string;
}

export interface StudyTopic {
  id: string;
  title: string;
  jlpt_level: string;
  category: string;
  description: string;
  order_index: number;
}

export interface TutorDecision {
  mode: 'learn' | 'review' | 'mastered';
  topic?: StudyTopic;
  progress?: any;
  message?: string;
}

export interface LessonExample {
  japanese: string;
  reading: string;
  spanish: string;
}

export interface LessonContent {
  topic_title: string;
  explanation: string;
  examples: LessonExample[];
  key_points: string[];
  jlpt_level: string;
}

export interface TopicProgress {
  id: string;
  topic_id: string;
  mastery_level: number;
  next_review_date: string;
  study_topics: StudyTopic;
}

export interface QuizOption {
  id: string; text: string;
}

export interface QuizQuestion {
  question_text: string;
  options: QuizOption[];
  correct_option_id: string;
  explanation: string;
  target_concept: string;
}

export interface TopicQuiz {
  questions: QuizQuestion[];
}