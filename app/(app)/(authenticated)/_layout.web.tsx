import { Slot, Link, usePathname } from 'expo-router';

import { Text, View } from 'react-native';

function AppHeader() {
  const pathname = usePathname();
  const activeTab = pathname.split('/')[0];

  return (
    <View className="flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <View className="flex-row items-center gap-8">
        <Link href="/" className="font-bold text-xl text-primary dark:text-white">
          <Text>My Studio</Text>
        </Link>
        <Link
          href="/courses"
          className={`hover:text-primary ${
            activeTab === 'courses'
              ? 'text-primary'
              : 'text-gray-600 dark:text-gray-300'
          }`}>
          <Text>Browse Courses</Text>
        </Link>
        <Link
          href="/my-content"
          className={`hover:text-primary ${
            activeTab === 'my-content'
              ? 'text-primary'
              : 'text-gray-600 dark:text-gray-300'
          }`}>
          <Text>My Courses</Text>
        </Link>
      </View>
      <Link
        href="/profile"
        className={`hover:text-primary ${
          activeTab === 'profile'
            ? 'text-primary'
            : 'text-gray-600 dark:text-gray-300'
        }`}>
        <Text>Profile</Text>
      </Link>
    </View>
  );
}

export default function Layout() {
  return (
    <View className="flex-1">
      <AppHeader />
      <Slot />
    </View>
  );
}
