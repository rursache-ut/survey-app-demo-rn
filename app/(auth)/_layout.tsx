import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen
        name="forgot-password"
        options={{ title: 'Forgot Password', headerLargeTitle: false }}
      />
      <Stack.Screen
        name="create-account"
        options={{ title: 'Create Account', headerLargeTitle: false }}
      />
    </Stack>
  );
}
