import "@/global.css"
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
// import { ClerkProvider, ClerkLoaded, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { Stack, useRouter, useSegments } from 'expo-router';
import { ActivityIndicator, LogBox, useColorScheme } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import React, { useEffect } from "react";
import { StrapiProvider } from "@/providers/StrapiProvider";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useReactQueryDevTools } from '@dev-plugins/react-query';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRealOrDummyIsLoaded, useRealOrDummyIsSignedIn } from "@/components/util";
import { DummyAuthProvider } from "@/providers/DummyAuthContext";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env'
  );
}
LogBox.ignoreLogs(['Clerk: Clerk has been loaded with development keys']);

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 60 * 1000,
    },
  },
});

export const unstable_settings = {
  initialRouteName: 'index',
};

const InitialLayout = () => {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  // const { isLoaded, isSignedIn } = useAuth();
  const isLoaded = useRealOrDummyIsLoaded();
  const isSignedIn = useRealOrDummyIsSignedIn();
  const router = useRouter();
  const segments = useSegments();
  useReactQueryDevTools(queryClient);

  useEffect(() => {
    if (loaded && isLoaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isLoaded]);

  useEffect(() => {
    // if (!loaded) return;
    if (!loaded || !isLoaded) return;

    const inAuthGroup = segments[1] === '(authenticated)';

    if (isSignedIn && !inAuthGroup) {
      router.replace('/(app)/(authenticated)/(tabs)');
    }
  }, [isLoaded, isSignedIn, loaded]);

  // Below code is problematic as it attempts to render something before any Stack or slot is rendered
  // on Root Layout, if I understood that issue correctly. The condition does not seem to happen at all
  // due to which I did not face the problem. It surfaced when I was attempting to remove even flash of
  // Login screen when I expanded the check. That resulted in an error in Android app
  // if (!isLoaded || !loaded) {
  //   return <ActivityIndicator size="large" />;
  // }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={publishableKey}
      waitlistUrl="/soon"
      >
      <DummyAuthProvider>
        <SafeAreaProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <ClerkLoaded>
              <QueryClientProvider client={queryClient}>
                <StrapiProvider>
                  <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                    <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
                    {/* Safe area for top-level content */}
                    <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
                      <InitialLayout />
                    </SafeAreaView>
                  </ThemeProvider>
                </StrapiProvider>
              </QueryClientProvider>
            </ClerkLoaded>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </DummyAuthProvider>  
    </ClerkProvider>
  )
}