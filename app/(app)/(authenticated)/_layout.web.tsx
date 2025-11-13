import { Slot, Link, usePathname } from 'expo-router';
import { Text, useWindowDimensions, View } from 'react-native';
import { MOBILE_LANDSCAPE_MAX_HEIGHT } from '@/constants';

function AppHeader() {
  const pathname = usePathname();
  const activeTab = pathname.split('/')[0];

  const dimensions = useWindowDimensions();
  const isMobileWebLandscape =
    dimensions.width > dimensions.height &&
    dimensions.height < MOBILE_LANDSCAPE_MAX_HEIGHT;

  return (
    <View className="flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <View className="flex-row items-center gap-4 xs:gap-8">
        <Link href="/" 
        className={`text-primary dark:text-white ${isMobileWebLandscape ? '' : 'xs:font-bold xs:text-xl' }`}
        >
          <Text>
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
            <Text>My Courses</Text>
          </Text>
        </Link>
      </View>

      <Link
        href="/profile"
        className={`hover:text-primary ${
          activeTab === 'profile'
            ? 'text-primary'
            : 'text-gray-600 dark:text-gray-300'
        }`}
      >
        <Text>
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
