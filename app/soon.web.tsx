// 'use client'; // Seems to be optional; I commented it out to keep it in sync with other files in project
//                // No other file in project has it.
import { View, ActivityIndicator, Text, useColorScheme } from 'react-native';
import { Waitlist } from '@clerk/clerk-react';
import '@/global.css';

export default function SoonWeb() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View
      className={`flex-1 items-center justify-center px-4 ${
        isDark ? 'bg-black' : 'bg-white'
      }`}
    >
      <View className="mb-10 justify-center items-center">
        <Text
          className={`text-3xl font-bold text-center mb-2 ${
            isDark ? 'text-white' : 'text-black'
          }`}
        >
          We're not yet open to the public
        </Text>
        <Text
          className={`text-base text-center ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          Please join the waitlist to get early access to the app
        </Text>
      </View>

      <Waitlist
        appearance={{
          variables: {
            colorPrimary: '#0d6c9a',
            colorBackground: isDark ? '#000' : '#fff',
            colorText: isDark ? '#fff' : '#000',
          },
        }}
        afterJoinWaitlistUrl="/wait"
        signInUrl="/login"
        fallback={<ActivityIndicator size="large" />}
      />
    </View>
  );
}
