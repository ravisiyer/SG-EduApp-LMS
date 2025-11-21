import { Link } from 'expo-router';
import { View, Text } from 'react-native';
import React from 'react';
import { usePathname } from 'expo-router';

export default function NotFoundScreen() {
  const pathname = usePathname();

  // To prevent flash of this page on Android app on login
  // Quick hack: render nothing for /sso-callback
  if (pathname === '/sso-callback') {
    return null;
  }

  return (
    <>
      <View className="flex-1 items-center justify-center p-5">
        <Text className="text-black dark:text-white">This screen doesn't exist.</Text>
        <Link href="/login" className="mt-4 py-4">
          <Text className="text-primary">Back to Login!</Text>
        </Link>
      </View>
    </>
  );
}
