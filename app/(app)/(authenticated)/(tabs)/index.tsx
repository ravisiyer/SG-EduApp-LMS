import { View, useColorScheme } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useStrapi } from '@/providers/StrapiProvider';
import HomeBlock from '@/components/HomeBlock';
import { Stack } from 'expo-router';
import LoadingView from '@/components/LoadingView';

export default function HomeScreen() {
  const colorScheme = useColorScheme() as 'light' | 'dark';
  const { getHomeInfo } = useStrapi();

  const { data, isLoading } = useQuery({
    queryKey: ['homeInfo'],
    queryFn: () => getHomeInfo(),
  });

  return (
    <View className="h-full flex-1">
      <Stack.Screen options={{ title: data?.title }} />
      {isLoading && <LoadingView />}

      {!isLoading && data && (
        <HomeBlock homeInfo={data} colorScheme={colorScheme} />
      )}
    </View>
  );
}
