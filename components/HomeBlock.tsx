'use dom';
import { HomeInfo } from '@/types/interfaces';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import '@/global.css';
import { Link } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import Animated, { FadeIn, Easing } from 'react-native-reanimated';

export default function HomeBlock({
  homeInfo,
  colorScheme
}: {
  homeInfo: HomeInfo;
  colorScheme: 'light' | 'dark';
  // dom: import('expo/dom').DOMProps;
}) {
  const blockContent = homeInfo?.content;

  return (
    <ScrollView className="w-screen" contentContainerStyle={{ flexGrow: 1 }}>
      <Animated.View
        className="pb-14"
        entering={FadeIn.duration(200).easing(Easing.ease)}
        style={{
          maxWidth: 800,
          width: '100%',        // take full width on small screens
          alignSelf: 'center',  // center horizontally
        }}        
      >
        <Image
          source={{ uri: homeInfo?.image }}
          className="w-full aspect-video"
          resizeMode="contain"
          style={{ maxHeight: 330 }}
        />
        <View className={`max-w-[800px] p-4 ${colorScheme === 'dark' ? 'text-white' : ''}`}>
          {blockContent && <BlocksRenderer content={blockContent} />}
        </View>
        <Link href="/courses" asChild>
          <TouchableOpacity className="bg-primary p-3 px-8 rounded-md mx-auto flex-row items-center justify-center gap-4">
            <FontAwesome5 name="yin-yang" size={24} color="white" className="animate-spin" />
            <Text className="text-center text-white font-bold">Browse Courses</Text>
          </TouchableOpacity>
        </Link>
      </Animated.View>
    </ScrollView>
  );
}
