import { Slot, Link, usePathname } from 'expo-router';
import { Text, View } from 'react-native';

function AppHeader() {
  const pathname = usePathname();
  const activeTab = pathname.split('/')[0];

  return (
    <View className="flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      {/* Left links */}
      <View className="flex-row items-center gap-4 xs:gap-8">
        <Link href="/" className="xs:font-bold xs:text-xl text-primary dark:text-white">
          <Text>
            {/* <Text className="xs:hidden">My Studio</Text>
            <Text className="hidden xs:inline">My Studio</Text> */}
            <Text>My Studio</Text>
          </Text>
        </Link>

        <Link
          href="/courses"
          className={`hover:text-primary ${
            activeTab === 'courses'
              ? 'text-primary'
              : 'text-gray-600 dark:text-gray-300'
          }`}
        >
          <Text>
            {/* <Text className="xs:hidden">Browse Courses</Text>
            <Text className="hidden xs:inline">Browse Courses</Text> */}
            <Text>Browse Courses</Text>
          </Text>
        </Link>

        <Link
          href="/my-content"
          className={`hover:text-primary ${
            activeTab === 'my-content'
              ? 'text-primary'
              : 'text-gray-600 dark:text-gray-300'
          }`}
        >
          <Text>
            {/* <Text className="xs:hidden">My Courses</Text>
            <Text className="hidden xs:inline">My Courses</Text> */}
            <Text>My Courses</Text>
          </Text>
        </Link>
      </View>

      {/* Right link */}
      <Link
        href="/profile"
        className={`hover:text-primary ${
          activeTab === 'profile'
            ? 'text-primary'
            : 'text-gray-600 dark:text-gray-300'
        }`}
      >
        <Text>
          {/* <Text className="xs:hidden">Profile</Text>
          <Text className="hidden xs:inline">Profile</Text> */}
          <Text>Profile</Text>
        </Text>
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
