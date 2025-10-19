import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { router, usePathname } from 'expo-router';
import { Image, View, Text, TouchableOpacity, Platform, useWindowDimensions, useColorScheme  } from 'react-native';
import { useStrapi } from '@/providers/StrapiProvider';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import { useQuery } from '@tanstack/react-query';
import { MOBILE_LANDSCAPE_MAX_HEIGHT } from '@/constants';
import { useEffect, useRef } from 'react';

function CustomDrawerContent(props: any) {
  const { getLessonsForCourse } = useStrapi();
  const { slug } = useLocalSearchParams();
  const pathname = usePathname();
  const colorScheme = useColorScheme();

  // ✅ Get the passed prop instead of recalculating
  const { isMobileWebLandscape } = props;

  const { data: lessons } = useQuery({
    queryKey: ['lessons', slug],
    queryFn: () => getLessonsForCourse(slug as string),
  });

  // Ref for the currently active lesson
  const activeLessonRef = useRef<HTMLDivElement | null>(null);

  // Scroll active lesson into view on web when lessonIndex changes
  useEffect(() => {
    if (Platform.OS === 'web' && activeLessonRef.current) {
      activeLessonRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [pathname, lessons, isMobileWebLandscape]);

  if (!lessons) {
    return <Text className="text-black dark:text-white">Loading...</Text>;
    // return <Text style={{ color: colorScheme === 'dark' ? '#fff' : '#000' }}>Loading...</Text>;
    // return <Text>Loading...</Text>;
  }

  return (
    <View className="flex-1 py-safe">
      {/* ✅ Hide top image when in mobile landscape */}
      {!isMobileWebLandscape && (
        <Image
          source={require('@/assets/images/yoga.png')}
          style={{ width: 200, height: 100, alignSelf: 'center' }}
          resizeMode="contain"
        />
      )}

      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <Text className="text-2xl font-bold p-4 text-black dark:text-white" >Lessons</Text>
        {/* <Text className="text-2xl font-bold p-4" style={{ color: colorScheme === 'dark' ? '#fff' : '#000' }}>Lessons</Text> */}
        {lessons.map((lesson) => {
          const isActive = pathname === `/course/${slug}/${lesson.lesson_index}`;
          return (
            <DrawerItem
              key={lesson.lesson_index}
              // ref={isActive ? activeLessonRef : null} // active lesson gets the ref
              // label={() => (
              //   <View ref={isActive ? activeLessonRef : null}>
              //     <Text className="dark:text-white">{lesson.name}</Text>
              //   </View>
              // )}
              label={() => {
                if (Platform.OS === 'web') {
                  // Use a plain div for web to attach ref
                  return (
                    <div ref={isActive ? activeLessonRef : null}>
                      <Text className="dark:text-white">{lesson.name}</Text>
                    </div>
                  );
                } else {
                  // Native: just use View, no ref needed
                  return (
                    <View>
                      <Text className="dark:text-white">{lesson.name}</Text>
                    </View>
                  );
                }
              }}              
              // label={() => <Text className="dark:text-white">{lesson.name}</Text>}
              onPress={() => router.push(`/course/${slug}/${lesson.lesson_index}`)}
              focused={isActive}
              icon={({ color, size }) =>
                lesson.completed ? (
                  <Entypo name="check" size={size} color={color} />
                ) : (
                  <Entypo name="circle" size={size} color={color} />
                )
              }
            />
          );
        })}
        <TouchableOpacity
          onPress={() => router.replace(`/my-content`)}
          className="flex-row items-center gap-2 p-4 pt-12">
          <Ionicons name="arrow-back" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
          <Text className="text-sm text-black dark:text-white">Back to my Content</Text>
          {/* <Text className="text-sm" style={{ color: colorScheme === 'dark' ? '#fff' : '#000' }}>Back to my Content</Text> */}
        </TouchableOpacity>
      </DrawerContentScrollView>

      <View className="border-t border-gray-200 pt-4  items-center">
        <Text className="text-sm text-gray-500">Copyright Simon 2025</Text>
      </View>
    </View>
  );
}

const Layout = () => {
  const dimensions = useWindowDimensions();
  const isMobileWebLandscape =
    Platform.OS === 'web' &&
    dimensions.width > dimensions.height &&
    dimensions.height < MOBILE_LANDSCAPE_MAX_HEIGHT;

  return (
    // <View><Text>Placeholder for Drawer</Text></View>
    <Drawer
      // ✅ Pass as prop here
      drawerContent={(props) => <CustomDrawerContent {...props} isMobileWebLandscape={isMobileWebLandscape} />}
      screenOptions={{
        drawerActiveTintColor: '#0d6c9a',
        drawerType: dimensions.width > 768 ? 'permanent' : 'front',
        drawerStyle: {
          width: isMobileWebLandscape ? 250 : (dimensions.width > 768 ? 350 : '80%'), 
        },
        headerShown: dimensions.width > 768 ? false : true,
        // headerShown: Platform.OS === 'web' ? false : true,
      }}>
      <Drawer.Screen
        name="overview"
        options={{
          title: 'Course Overview',
          // drawerIcon: () => (
          //   <Ionicons name="book-outline" />
          // ),
        drawerIcon: isMobileWebLandscape
          ? undefined
          : ({ color, size }) => <Ionicons name="book-outline" size={size} color={color} />,
          // drawerIcon: ({ color, size }) => (
          //   isMobileWebLandscape
          //     ? (undefined)
          //     : (<Ionicons name="book-outline" size={size} color={color} />) 
          // ),
        }}
      />
      <Drawer.Screen
        name="index"
        options={{
          drawerItemStyle: {
            display: 'none',
          },
        }}
      />
    </Drawer>
  );
};
export default Layout;
