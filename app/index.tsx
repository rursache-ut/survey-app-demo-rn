import { Redirect } from 'expo-router';
import { useAuthStore } from '@/features/auth/store/authStore';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }
  return <Redirect href={user ? '/(main)/surveys' : '/(auth)/login'} />;
}
