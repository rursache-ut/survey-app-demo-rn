import { useEffect, useState } from 'react';
import type { Survey } from '@/core/models';
import { surveyRepository } from '@/core/repositories';

type PreviewState = {
  survey: Survey | null;
  isLoading: boolean;
  error: string | null;
};

export function useSurveyPreview(id: string | undefined): PreviewState {
  const [state, setState] = useState<PreviewState>({
    survey: null,
    isLoading: true,
    error: null,
  });

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

  return state;
}
