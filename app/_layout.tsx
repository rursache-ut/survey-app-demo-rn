import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';

export default function RootLayout() {
  const scheme = useColorScheme();
  const paperTheme = scheme === 'dark' ? MD3DarkTheme : MD3LightTheme;
  const navTheme = scheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={paperTheme}>
          <ThemeProvider value={navTheme}>
            <StatusBar style="auto" />
          <Stack
            screenOptions={{
              headerTransparent: false,
              headerBackButtonDisplayMode: 'minimal',
              headerTitleStyle: { fontWeight: '600' },
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(main)" options={{ headerShown: false }} />
            <Stack.Screen
              name="settings"
              options={{
                presentation: 'formSheet',
                title: 'Settings',
                headerLargeTitle: false,
                headerTransparent: true,
                headerBackButtonDisplayMode: 'minimal',
                sheetGrabberVisible: true,
                sheetAllowedDetents: [1.0],
              }}
            />
            <Stack.Screen
              name="runner"
              options={{ headerShown: false, gestureEnabled: false }}
            />
          </Stack>
          </ThemeProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
