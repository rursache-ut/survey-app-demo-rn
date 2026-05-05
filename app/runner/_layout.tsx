import { Stack } from 'expo-router';

export default function RunnerLayout() {
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
