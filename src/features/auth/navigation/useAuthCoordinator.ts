import { useRouter } from 'expo-router';

export function useAuthCoordinator() {
  const router = useRouter();
  return {
    goToForgotPassword: () => router.push('/(auth)/forgot-password'),
    goToCreateAccount: () => router.push('/(auth)/create-account'),
    onSignedIn: () => router.replace('/(main)/surveys'),
  };
}
