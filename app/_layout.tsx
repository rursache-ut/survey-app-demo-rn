import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LogBox, Platform, useColorScheme } from 'react-native';
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';

// Hide the in-app warning toast in dev. Logs still print to Metro.
if (__DEV__) LogBox.ignoreAllLogs();

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
                  title: 'Settings',
                  headerBackButtonDisplayMode: 'minimal',
                  // formSheet + sheet* options are iOS-only; on Android they
                  // throw at the native screens layer, so use a plain modal
                  ...(Platform.OS === 'ios'
                    ? {
                        presentation: 'formSheet' as const,
                        headerLargeTitle: false,
                        headerTransparent: true,
                        sheetGrabberVisible: true,
                        sheetAllowedDetents: [1.0],
                      }
                    : { presentation: 'modal' as const }),
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
