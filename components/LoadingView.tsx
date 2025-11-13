import { View, Text, ActivityIndicator } from 'react-native';

const LoadingView = () => {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <ActivityIndicator size="large" />
      <Text className="mt-4 text-black dark:text-white">Loading...</Text>
      <View className="mt-4">
        <Text className="mt-2 px-2 text-left text-black dark:text-white">
          Due to 'Cold start' of free-tier backend, first Strapi (data) response may take up to a minute.
        </Text>
        <Text className="mt-2 px-2 text-left text-black dark:text-white">
          Please be patient. Subsequent responses should be much faster.
        </Text>
      </View>
    </View>

  );
};

export default LoadingView;
