import { useAuthStore } from '@/features/auth/store/authStore';
import { useSurveyListStore } from '@/features/surveys/store/surveyListStore';
import { useSurveyRunnerStore } from '@/features/survey-runner/store/surveyRunnerStore';

export type RewardSnapshot = { title: string; payoutCents: number };

// User abandons an in-progress survey: mark it completed (so it disappears
// from the list per product spec) and clear runner state
export function quitSurvey(): void {
  const survey = useSurveyRunnerStore.getState().survey;
  if (!survey) return;
  useSurveyListStore.getState().markCompleted(survey.id);
  useSurveyRunnerStore.getState().abandon();
}

// User finished all questions: award the payout, mark completed, clear runner
// state. Returns the snapshot needed by the reward screen since runner state
// is reset before the screen reads it again
export function claimSurveyReward(): RewardSnapshot | null {
  const survey = useSurveyRunnerStore.getState().survey;
  if (!survey) return null;
  const snapshot: RewardSnapshot = {
    title: survey.title,
    payoutCents: survey.payoutCents,
  };
  useAuthStore.getState().awardCents(survey.payoutCents);
  useSurveyListStore.getState().markCompleted(survey.id);
  useSurveyRunnerStore.getState().finish();
  return snapshot;
}
