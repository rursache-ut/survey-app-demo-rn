import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LogBox, Platform, useColorScheme } from 'react-native';
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';

// Silence only known-noisy third-party warnings in dev; everything else
// still surfaces in the in-app overlay and Metro.
if (__DEV__) {
  LogBox.ignoreLogs([
    // Reanimated chatter under fast refresh
    /^Sending `onAnimatedValueUpdate` with no listeners registered/,
    // Common third-party module warning on RN >= 0.65
    /^new NativeEventEmitter\(\)/,
    // Require cycles from transitive deps in node_modules
    /^Require cycle:/,
  ]);
}

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
