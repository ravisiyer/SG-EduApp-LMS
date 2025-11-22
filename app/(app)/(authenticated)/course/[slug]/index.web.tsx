import { View, Text, Pressable, ActivityIndicator, useWindowDimensions, useColorScheme } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useStrapi } from '@/providers/StrapiProvider';
import { useQuery } from '@tanstack/react-query';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  FadeIn,
} from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { useRevenueCat } from '@/providers/RevenueCatProvider';
import { Toaster, toast } from 'sonner';
import LoadingView from '@/components/LoadingView';
import StrapiBlocksRenderer from '@/components/StrapiBlocksRenderer';
const HEADER_HEIGHT = 200; // Increased height for better parallax effect
const HEADER_SCALE = 1.8; // Maximum scale for the parallax effect

const Page = () => {
  const colorScheme = useColorScheme() as 'light' | 'dark';
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { getCourse, addUserToCourse, userHasCourse } = useStrapi();
  const { width: windowWidth } = useWindowDimensions();
  const scrollY = useSharedValue(0);
  const [hasCourse, setHasCourse] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); 

  const { webPackages, purchaseWebPackage } = useRevenueCat();

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', slug],
    queryFn: () => getCourse(slug),
  });

  const productPackage = webPackages?.find(
    (pkg) => pkg.webBillingProduct.identifier === course?.revenuecatId
  );

  // Check if user has course access
  useEffect(() => {
    let cancelled = false;
    if (course) {
      userHasCourse(course.documentId.toString()).then((result) => {
        if (!cancelled) setHasCourse(result);
      });
    }
    return () => {
      cancelled = true;
    };
  }, [course]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const imageAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
      [HEADER_SCALE, 1, 1]
    );

    const translateY = interpolate(
      scrollY.value,
      [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
      [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
    );

    return {
      transform: [{ scale }, { translateY }],
    };
  });

  if (isLoading) {
    return (<LoadingView innerScreen={true} />);
  }

  if (!course) {
    return (
      <View className="flex-1 items-center justify-center mt-10">
        <Text>Course not found</Text>
      </View>
    );
  } 

  const onStartCourse = async () => {
    if (!course || isProcessing) return; // prevent double clicks
    setIsProcessing(true);

    try {
      if (hasCourse) {
        // User already has course access, redirect to overview page
        router.replace(`/(app)/(authenticated)/course/${slug}/overview/overview`);
      } else {
        if (course.isPremium) {
          // Premium course, needs to be purchased
          // Below lines of code handle case of no web app in RevenueCat
          if (!productPackage) {
            toast('This course is not available for purchase on Web');
            return;
          }
          const result = await purchaseWebPackage!(productPackage!);

          const activeEntitlements = result?.customerInfo.entitlements.active;
          if (activeEntitlements) {
            const hasMatch = Object.values(activeEntitlements).some(
              (activeEntitlement: any) =>
                activeEntitlement.productIdentifier === productPackage.webBillingProduct.identifier
            );

            if (hasMatch) {
              const addCourseResult = await addUserToCourse(course.documentId.toString());
              if (addCourseResult) {
                router.replace(`/(app)/(authenticated)/course/${slug}/overview/overview`);
                // Original tutorial code had an issue if user closed the toast instead of 
                // click on the Start Course button. Then user remained on this screen which was
                // odd. So I simply am taking user to course overview directly.
                
                // Below toast flashes briefly and so chose to directly go to course overview screen
                // If toast is necessary, timeout period will have to be experimented with.
                // toast('Thanks for your purchase. You can now start the course!');
                // setTimeout(() => {
                //   router.replace(`/(app)/(authenticated)/course/${slug}/overview/overview`);
                // }, 600); // 600ms delay
              } else {
                console.error(
                  "addUserToCourse failed for course.documentId: ",
                  course.documentId.toString()
                );
                toast.error("We could not add this course to your account. Please contact support.");
              }
            } else {
              console.error(
                "Purchase succeeded but no matching entitlement found for product:",
                productPackage.webBillingProduct.identifier
              );
              toast.error("Purchase successful but course not unlocked. Please contact support.");
            }
          }
        } else {
          // Free course, add user to course
          const result = await addUserToCourse(course.documentId.toString());
          if (result) {
            router.replace(`/(app)/(authenticated)/course/${slug}/overview/overview`);
          }
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <Animated.ScrollView
      entering={FadeIn}
      className="flex-1 bg-white dark:bg-black"
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      contentContainerStyle={{ flexGrow: 1 }}>
      <Toaster position="top-right" />

      <View className="relative" style={{ height: HEADER_HEIGHT }}>
        <Animated.Image
          source={{ uri: course.image }}
          className="absolute w-full object-cover"
          style={[
            imageAnimatedStyle,
            {
              height: HEADER_HEIGHT,
              width: windowWidth,
            },
          ]}
          resizeMode="cover"
        />
      </View>

      {/* Course Info Section */}
      <View className="flex-1 px-4 pt-4 bg-white dark:bg-black">
        <Text className="text-2xl font-bold text-gray-800 dark:text-white">{course.title}</Text>

        <Pressable
          onPress={onStartCourse}
          disabled={isProcessing}
          className={`mt-4 rounded-lg py-3 items-center max-w-sm
            ${isProcessing ? 'bg-blue-300' : 'bg-blue-500'}`}
        >
          {isProcessing ? (
            <ActivityIndicator color="white" />
          ) : (
          <Text className="text-white font-semibold text-lg">
            {
              hasCourse
                ? 'Continue Course'
                : (
                    course.isPremium
                      ? (
                          productPackage
                            ? `Purchase Course for ${productPackage?.webBillingProduct.price.formattedPrice}`
                            : `Purchase not available for web`
                        )
                      : 'Start Course'
                  )
            }
          </Text>
          )}
        </Pressable>

        <View className="py-4">
          <StrapiBlocksRenderer
            colorScheme={colorScheme}
            blockContent={course.description}
          />
        </View>

        {/* Lessons Section */}
        <Text className="mt-6 mb-2 text-xl font-semibold text-gray-800 dark:text-white">
          Course Content
        </Text>
      </View>

      {/* Lessons List */}
      <View className="px-4 pb-6">
        {course.lessons.map((lesson) => (
          <View key={lesson.id} className="flex-row items-center py-4 border-b border-gray-100">
            <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-3">
              <Text className="text-gray-600 font-medium">{lesson.lesson_index}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-800 font-medium dark:text-white">{lesson.name}</Text>
            </View>
          </View>
        ))}
      </View>
    </Animated.ScrollView>
  );
};

export default Page;
