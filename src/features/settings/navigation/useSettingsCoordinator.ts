import { useRouter } from 'expo-router';
import { useAuthStore } from '@/features/auth/store/authStore';

export function useSettingsCoordinator() {
  const router = useRouter();
  const signOut = useAuthStore((s) => s.signOut);
  return {
    signOutAndExit: () => {
      signOut();
      router.replace('/(auth)/login');
    },
  };
}
