import { View, ActivityIndicator, Platform, Text, useColorScheme } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useStrapi } from '@/providers/StrapiProvider';
import HomeBlock from '@/components/HomeBlock';
import { Stack } from 'expo-router';
import { useState } from 'react';
import LoadingView from '@/components/LoadingView';

export default function HomeScreen() {
  const colorScheme = useColorScheme() as 'light' | 'dark';
  // console.log('(tab)/index.tsx: colorScheme', colorScheme);
  const { getHomeInfo } = useStrapi();
  // const [isLoading, setIsLoading] = useState(Platform.OS === 'web' ? false : true);

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
