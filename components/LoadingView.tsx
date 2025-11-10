import { View, Text, ActivityIndicator } from 'react-native';

const LoadingView = () => {
  return (
    <View className="flex-1 items-center justify-center px-6">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-black dark:text-white">Loading...</Text>
        <Text className="mt-2 text-center text-black dark:text-white">
        Due to free-tier backend, response, especially first response, may be slow.
        </Text>
    </View>
  );
};

export default LoadingView;
