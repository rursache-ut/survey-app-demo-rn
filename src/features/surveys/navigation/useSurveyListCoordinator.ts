import { useRouter } from 'expo-router';

export function useSurveyListCoordinator() {
  const router = useRouter();
  return {
    openSettings: () => router.push('/settings'),
    startSurvey: (id: string) => router.push(`/runner/${id}/intro`),
  };
}
