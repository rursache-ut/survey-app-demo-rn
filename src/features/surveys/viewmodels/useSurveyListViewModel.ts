import { useEffect, useMemo } from 'react';
import { useSurveyListStore } from '@/features/surveys/store/surveyListStore';

export function useSurveyListViewModel() {
  const surveys = useSurveyListStore((s) => s.surveys);
  const completedIds = useSurveyListStore((s) => s.completedIds);
  const isLoading = useSurveyListStore((s) => s.isLoading);
  const error = useSurveyListStore((s) => s.error);
  const load = useSurveyListStore((s) => s.load);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(
    () =>
      surveys
        .filter((s) => !completedIds.includes(s.id))
        .sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime()),
    [surveys, completedIds]
  );

  return { surveys: visible, isLoading, error, refresh: load };
}
