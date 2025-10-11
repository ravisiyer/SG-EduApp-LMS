import React from 'react';
import {
  View,
  Text,
  Alert,
  BackHandler,
  useColorScheme,
  Pressable,
} from 'react-native';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import '@/global.css';

export default function SoonNative() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const webSoonUrl = process.env.EXPO_PUBLIC_WEB_SOON_URL;

  const handleJoinWeb = () => {
    if (!webSoonUrl) {
      Alert.alert(
        'Waitlist unavailable',
        'The web waitlist URL is not configured. Please try again later.'
      );
      return;
    }

    Alert.alert(
      'Join the waitlist',
      'Sign-ups are currently unavailable on mobile.\n\nWould you like to open the web waitlist?',
      [
        {
          text: 'Open Web Waitlist',
          onPress: () => Linking.openURL(webSoonUrl),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <View
      className={`flex-1 items-center justify-center px-6 ${
        isDark ? 'bg-black' : 'bg-white'
      }`}
    >
      <Text
        className={`text-2xl font-bold text-center mb-4 ${
          isDark ? 'text-white' : 'text-black'
        }`}
      >
        We're not yet open to the public
      </Text>

      <Text
        className={`text-base text-center mb-8 ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}
      >
        Please join the waitlist using our website.
      </Text>

      {webSoonUrl && (
        <Pressable
          onPress={handleJoinWeb}
          className={`w-full max-w-sm py-3 rounded-xl mb-6 ${
            isDark ? 'bg-blue-600' : 'bg-blue-500'
          }`}
        >
          <Text className="text-center text-white font-semibold text-base">
            Join Waitlist (opens web)
          </Text>
        </Pressable>
      )}

      {/* Inline “Already have access? Sign in” section */}
      <View className="flex-row items-center justify-center mb-8">
        <Text
          className={`text-base mr-2 ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          Already have access?
        </Text>
        <Pressable onPress={() => router.replace('/login')}>
          <Text className="text-blue-500 text-base font-semibold">Sign in</Text>
        </Pressable>
      </View>

      {/* Exit App as Pressable */}
      <Pressable
        onPress={() => BackHandler.exitApp()}
        className={`w-full max-w-sm py-3 rounded-xl border ${
          isDark ? 'border-gray-700' : 'border-gray-300'
        }`}
      >
        <Text
          className={`text-center font-semibold text-base ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          Exit App
        </Text>
      </Pressable>
    </View>
  );
}
