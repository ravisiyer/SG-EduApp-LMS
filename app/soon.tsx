import React from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  BackHandler,
  useColorScheme,
} from 'react-native';
import * as Linking from 'expo-linking';
import '@/global.css';

export default function SoonNative() {
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
        <View className="w-full max-w-sm">
          <Button title="Join Waitlist (opens web)" onPress={handleJoinWeb} />
        </View>
      )}

      <View className="w-full max-w-sm mt-4">
        <Button title="Exit App" color="#999" onPress={() => BackHandler.exitApp()} />
      </View>
    </View>
  );
}
