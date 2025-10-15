'use dom';
import { HomeInfo } from '@/types/interfaces';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
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
  dom: import('expo/dom').DOMProps;
}) {
  const blockContent = homeInfo?.content;
  // blockContent && console.log('blockContent', blockContent);

  const windowWidth = Dimensions.get('window').width;
  const isMobileWidth = windowWidth < 768;

  console.log('windowWidth', windowWidth, 'isMobileWidth', isMobileWidth);
  return (
    <Animated.View className="w-screen pb-14" entering={FadeIn.duration(200).easing(Easing.ease)}>
      {/* <Image source={{ uri: homeInfo?.image }} className="w-screen h-40" /> */}
      {/* <Image source={{ uri: homeInfo?.image }} className="w-screen h-40" resizeMode="contain" /> */}
       <Image 
          source={{ uri: homeInfo?.image }} 
            // className={isMobileWidth ? 'w-full aspect-video' : 'w-full h-[40vh]'}
            className={isMobileWidth ? 'w-full aspect-video' : 'w-full h-40'}
            resizeMode={isMobileWidth ? 'contain' : 'stretch'}
        />
     <View className={`w-screen p-4 ${colorScheme === 'dark' ? 'text-white' : ''}`}>
          {blockContent && <BlocksRenderer content={blockContent}/>}
      </View>
      <Link href="/courses" asChild>
        <TouchableOpacity className="bg-primary p-4 px-8 rounded-md mx-auto flex-row items-center justify-center gap-4">
          <FontAwesome5 name="yin-yang" size={24} color="white" className="animate-spin" />
          <Text className="text-center text-white font-bold">Browse Courses</Text>
        </TouchableOpacity>
      </Link>
    </Animated.View>
  );
}
