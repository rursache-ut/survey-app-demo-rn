import { useEffect, useState } from 'react';
import type { Survey } from '@/core/models';
import { surveyRepository } from '@/core/repositories';
import { useSurveyRunnerStore } from '@/features/survey-runner/store/surveyRunnerStore';

type IntroState = {
  survey: Survey | null;
  isLoading: boolean;
  error: string | null;
};

export function useSurveyIntroViewModel(id: string | undefined) {
  const [state, setState] = useState<IntroState>({
    survey: null,
    isLoading: true,
    error: null,
  });
  const start = useSurveyRunnerStore((s) => s.start);
  const isStarting = useSurveyRunnerStore((s) => s.isLoading);

  useEffect(() => {
    if (!id) {
      setState({ survey: null, isLoading: false, error: 'Missing survey id' });
      return;
    }
    let cancelled = false;
    setState({ survey: null, isLoading: true, error: null });
    surveyRepository
      .getSurvey(id)
      .then((survey) => {
        if (!cancelled) setState({ survey, isLoading: false, error: null });
      })
      .catch(() => {
        if (!cancelled) {
          setState({ survey: null, isLoading: false, error: 'Could not load survey' });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return {
    survey: state.survey,
    isLoading: state.isLoading,
    error: state.error,
    isStarting,
    begin: async () => {
      if (!id) return false;
      return start(id);
    },
  };
}
