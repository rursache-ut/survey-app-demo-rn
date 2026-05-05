export type Difficulty = 'easy' | 'medium' | 'hard';

export type SurveySponsor = {
  name: string;
  logoUrl: string;
};

export type SingleSelectQuestion = {
  id: string;
  type: 'single-select';
  prompt: string;
  options: { id: string; label: string }[];
};

export type MultiSelectQuestion = {
  id: string;
  type: 'multi-select';
  prompt: string;
  options: { id: string; label: string }[];
  minSelections?: number;
  maxSelections?: number;
};

export type FreeTextQuestion = {
  id: string;
  type: 'free-text';
  prompt: string;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
};

export type SliderQuestion = {
  id: string;
  type: 'slider';
  prompt: string;
  min: number;
  max: number;
  step: number;
  unit?: string;
};

export type TopXQuestion = {
  id: string;
  type: 'top-x';
  prompt: string;
  options: { id: string; label: string }[];
  topCount: number;
};

export type Question =
  | SingleSelectQuestion
  | MultiSelectQuestion
  | FreeTextQuestion
  | SliderQuestion
  | TopXQuestion;

export type Survey = {
  id: string;
  title: string;
  description: string;
  payoutCents: number;
  expiresAt: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  sponsor: SurveySponsor;
  questions: Question[];
};

export type AnswerValue =
  | { type: 'single-select'; optionId: string }
  | { type: 'multi-select'; optionIds: string[] }
  | { type: 'free-text'; text: string }
  | { type: 'slider'; value: number }
  | { type: 'top-x'; orderedOptionIds: string[] };

export type Answer = {
  questionId: string;
  value: AnswerValue;
};

export type AuthAccount = {
  email: string;
  password: string;
  fullName: string;
  avatarUrl: string;
};

export type User = {
  email: string;
  fullName: string;
  avatarUrl: string;
};
