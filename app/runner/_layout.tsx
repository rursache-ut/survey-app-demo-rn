import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuthStore } from '@/features/auth/store/authStore';

export default function RunnerLayout() {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack screenOptions={{ gestureEnabled: false }}>
      <Stack.Screen
        name="[id]/intro"
        options={{ headerShown: false, gestureEnabled: true }}
      />
      <Stack.Screen
        name="[id]/question"
        options={{
          title: '',
          headerBackVisible: false,
          gestureEnabled: false,
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="[id]/reward"
        options={{
          title: '',
          headerBackVisible: false,
          gestureEnabled: false,
          headerTransparent: true,
        }}
      />
    </Stack>
  );
}
