import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Answer, AnswerValue, Survey } from '@/core/models';
import { surveyRepository } from '@/core/repositories';
import { createJSONStorage } from '@/core/storage/zustandStorage';

type RunnerState = {
  survey: Survey | null;
  questionIndex: number;
  answers: Record<string, AnswerValue>;
  startedAt: number | null;
  isLoading: boolean;
};

type RunnerActions = {
  start: (surveyId: string) => Promise<void>;
  submitAnswer: (questionId: string, value: AnswerValue) => void;
  abandon: () => void;
  finish: () => Answer[];
};

export const useSurveyRunnerStore = create<RunnerState & RunnerActions>()(
  persist(
    (set, get) => ({
      survey: null,
      questionIndex: 0,
      answers: {},
      startedAt: null,
      isLoading: false,

      start: async (surveyId) => {
        set({ isLoading: true });
        const survey = await surveyRepository.getSurvey(surveyId);
        set({
          survey,
          questionIndex: 0,
          answers: {},
          startedAt: Date.now(),
          isLoading: false,
        });
      },

      submitAnswer: (questionId, value) => {
        const { survey, questionIndex, answers } = get();
        if (!survey) return;
        const next = questionIndex + 1;
        set({
          answers: { ...answers, [questionId]: value },
          questionIndex: next,
        });
      },

      abandon: () => {
        set({ survey: null, questionIndex: 0, answers: {}, startedAt: null });
      },

      finish: () => {
        const { survey, answers } = get();
        const out: Answer[] = survey
          ? survey.questions
              .filter((q) => answers[q.id])
              .map((q) => ({ questionId: q.id, value: answers[q.id]! }))
          : [];
        set({ survey: null, questionIndex: 0, answers: {}, startedAt: null });
        return out;
      },
    }),
    {
      name: 'sayso/runner',
      storage: createJSONStorage(),
      partialize: (s) => ({
        survey: s.survey,
        questionIndex: s.questionIndex,
        answers: s.answers,
        startedAt: s.startedAt,
      }),
    }
  )
);
