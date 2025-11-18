import { View, Text, ActivityIndicator } from "react-native";

const LoadingView = ({ innerScreen = false }: { innerScreen?: boolean }) => {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <ActivityIndicator size="large" />
      <Text className="mt-4 text-black dark:text-white">Loading...</Text>
      <View className="mt-4">
        {innerScreen ? (
          <Text className="mt-6 px-2 text-left text-black dark:text-white">
            May take up to a minute if Strapi free-tier has scaled down.
          </Text>
        ) : (
          <>
            <Text className="mt-2 px-2 text-left text-black dark:text-white">
              Due to 'Cold start' of free-tier backend, first Strapi (data)
              response may take up to a minute.
            </Text>
            <Text className="mt-2 px-2 text-left text-black dark:text-white">
              Please be patient. Subsequent responses should be much faster.
            </Text>
            <Text className="mt-10 px-2 text-left text-black dark:text-white">
              Note: Strapi free-tier scales down after a few minutes of
              inactivity, requiring another 'Cold start'.
            </Text>
          </>
        )}
      </View>
    </View>
  );
};

export default LoadingView;
