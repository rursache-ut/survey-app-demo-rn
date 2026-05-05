import { useCallback } from 'react';
import { useSurveyRunnerStore } from '@/features/survey-runner/store/surveyRunnerStore';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useSurveyListStore } from '@/features/surveys/store/surveyListStore';

export type RewardSnapshot = { title: string; payoutCents: number };

export function useSurveyRunnerViewModel() {
  const survey = useSurveyRunnerStore((s) => s.survey);
  const idx = useSurveyRunnerStore((s) => s.questionIndex);
  const submit = useSurveyRunnerStore((s) => s.submitAnswer);

  const totalQuestions = survey?.questions.length ?? 0;
  const currentQuestion = survey ? survey.questions[idx] ?? null : null;
  const isFinished = survey != null && idx >= totalQuestions;
  const progress = totalQuestions > 0 ? Math.min(idx / totalQuestions, 1) : 0;

  // quit and claimReward read state imperatively so the callbacks stay
  // referentially stable; that lets reward.tsx use them in a useEffect dep
  // array without re-firing the side effect on every render
  const quit = useCallback(() => {
    const current = useSurveyRunnerStore.getState().survey;
    if (!current) return;
    useSurveyListStore.getState().markCompleted(current.id);
    useSurveyRunnerStore.getState().abandon();
  }, []);

  const claimReward = useCallback((): RewardSnapshot | null => {
    const current = useSurveyRunnerStore.getState().survey;
    if (!current) return null;
    const snapshot: RewardSnapshot = {
      title: current.title,
      payoutCents: current.payoutCents,
    };
    useAuthStore.getState().awardCents(current.payoutCents);
    useSurveyListStore.getState().markCompleted(current.id);
    useSurveyRunnerStore.getState().finish();
    return snapshot;
  }, []);

  return {
    survey,
    currentQuestion,
    questionIndex: idx,
    totalQuestions,
    isFinished,
    progress,
    submitAnswer: submit,
    quit,
    claimReward,
  };
}
