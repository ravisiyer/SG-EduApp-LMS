'use dom';
import { HomeInfo } from '@/types/interfaces';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { View, Text, Image, TouchableOpacity } from 'react-native';
// import { View, Text, Image, TouchableOpacity, useColorScheme } from 'react-native';
import '@/global.css';
import { Link } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import Animated, { FadeIn, Easing } from 'react-native-reanimated';
import { getStrapiMedia } from '@/lib/getStrapiMedia';

export default function HomeBlock({
  homeInfo,
  colorScheme
}: {
  homeInfo: HomeInfo;
  colorScheme: 'light' | 'dark';
  dom: import('expo/dom').DOMProps;
}) {
  // const colorScheme = useColorScheme(); // 'light' or 'dark'
  // const textColor = colorScheme === 'dark' ? '#fff' : '#000';  
  // const textColor = colorScheme === 'dark' ? 'text-white' : '';  
  // const viewClassName = "w-screen p-4 " + textColor;
  const blockContent = homeInfo?.content;

  blockContent && console.log('blockContent', blockContent);
  console.log('In HomeBlock: colorScheme prop', colorScheme);
  return (
    // <Animated.View className="w-full pb-14" entering={FadeIn.duration(200).easing(Easing.ease)}>
    <Animated.View className="w-screen pb-14" entering={FadeIn.duration(200).easing(Easing.ease)}>
      <Image source={{ uri: getStrapiMedia(homeInfo?.image) }} className="w-screen h-40" />
      {/* <Image source={{ uri: getStrapiMedia(homeInfo?.image) }} className="w-full h-40" /> */}
      {/* <View className="w-screen p-4 dark:text-white text-white"> */}
      {/* <View className="w-screen p-4 "> */}
      {/* <View className= {colorScheme === 'dark' ? "w-screen p-4 text-white" : "w-screen p-4"}> */}
      {/* <View className= "w-screen p-4 text-white"> */}
      {/* <View className={viewClassName}> */}
        {/* <View className={`w-screen p-4 ${colorScheme === 'dark' ? 'text-white' : ''}`}> */}
      {colorScheme === 'dark' ? 
        <View className="w-screen p-4 text-white ">
            <Text className='text-white'>Dark mode</Text>
            {blockContent && 
            <BlocksRenderer
              content={blockContent}
              blocks={{
                image: ({ image }) => (
                  <Image
                    source={{ uri: getStrapiMedia(image.url) }}
                    style={{ width: image.width ?? 300, height: image.height ?? 300 }}
                    resizeMode="cover"
                  />
                ),
              }}
            />}
        </View>
      :
        <View className="w-screen p-4 ">
            <Text className='text-yellow-600'>Light mode</Text>
            {blockContent && 
            <BlocksRenderer
              content={blockContent}
              blocks={{
                image: ({ image }) => (
                  <Image
                    source={{ uri: getStrapiMedia(image.url) }}
                    style={{ width: image.width ?? 300, height: image.height ?? 300 }}
                    resizeMode="cover"
                  />
                ),
              }}
            />}
      </View>
      }
      <Link href="/courses" asChild>
        <TouchableOpacity className="bg-primary p-4 px-8 rounded-md mx-auto flex-row items-center justify-center gap-4">
          <FontAwesome5 name="yin-yang" size={24} color="white" className="animate-spin" />
          <Text className="text-center text-white font-bold">Browse Courses</Text>
        </TouchableOpacity>
      </Link>
    </Animated.View>
  );
}
