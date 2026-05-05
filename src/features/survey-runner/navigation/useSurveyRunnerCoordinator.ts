import { useRouter } from 'expo-router';

export function useSurveyRunnerCoordinator() {
  const router = useRouter();
  return {
    enterSurvey: (id: string) => router.replace(`/runner/${id}/question`),
    goToReward: (id: string) => router.replace(`/runner/${id}/reward`),
    exitToList: () => router.replace('/(main)/surveys'),
  };
}
