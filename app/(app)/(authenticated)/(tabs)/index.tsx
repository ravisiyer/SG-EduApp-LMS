import { View, ActivityIndicator, Platform, useColorScheme } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useStrapi } from '@/providers/StrapiProvider';
import HomeBlock from '@/components/HomeBlock';
import { Stack } from 'expo-router';
import { useState } from 'react';

export default function HomeScreen() {
  // const colorScheme = useColorScheme(); // 'light' or 'dark'
  const colorScheme = useColorScheme() as 'light' | 'dark';
  console.log('(tab)/index.tsx: colorScheme', colorScheme);
  const { getHomeInfo } = useStrapi();
  const [isLoading, setIsLoading] = useState(Platform.OS === 'web' ? false : true);

  const { data } = useQuery({
    queryKey: ['homeInfo'],
    queryFn: () => getHomeInfo(),
  });

  return (
    <View className="h-full flex-1">
      <Stack.Screen options={{ title: data?.title }} />
      {isLoading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      )}
      <HomeBlock
        homeInfo={data!}
        colorScheme={colorScheme}
        dom={{
          scrollEnabled: false,
          matchContents: false,
          // matchContents: true,
          onLoadEnd: () => {
            setIsLoading(false);
          },
        }}
      />
    </View>
  );
}
