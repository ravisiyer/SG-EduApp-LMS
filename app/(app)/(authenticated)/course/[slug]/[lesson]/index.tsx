import { View, ScrollView, Text, TouchableOpacity, ActivityIndicator, Platform, useColorScheme, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useStrapi } from '@/providers/StrapiProvider';
import RichtTextContent from '@/components/RichtTextContent';
import { useEventListener } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { Confetti, ConfettiMethods } from 'react-native-fast-confetti';
import { useEffect, useRef, useState } from 'react';
import { MOBILE_LANDSCAPE_MAX_HEIGHT } from '@/constants';
import LoadingView from '@/components/LoadingView';

const Page = () => {
  const colorScheme = useColorScheme() as 'light' | 'dark';
  const { slug, lesson: lessonIndex } = useLocalSearchParams<{ slug: string; lesson: string }>();
  const { getLessonForCourse, markLessonAsCompleted, getLessonsForCourse, updateUserCourseProgress } = useStrapi();
  const player = useVideoPlayer(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const confettiRef = useRef<ConfettiMethods>(null);
  const [isMounted, setIsMounted] = useState(false);
  const externalNavigationRef  = useRef(true);
  const lastLessonIndexRef = useRef<string | null>(null);

  const dimensions = useWindowDimensions();
  const isMobileWebLandscape =
    Platform.OS === 'web' &&
    dimensions.width > dimensions.height &&
    dimensions.height < MOBILE_LANDSCAPE_MAX_HEIGHT;

  useEffect(() => {
    // Give the player a short time to settle before we start reacting to events
    // A better approach might be to listen for a "ready" event from the player.
    // But I don't want to invest time in figuring out the exact code to do that now.
    // This workaround is good enough for the tutorial code, IMHO, as of now at least.
    const timer = setTimeout(() => setIsMounted(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const { data: lessons, isLoading: lessonsLoading } = useQuery({
    queryKey: ['lessons', slug],
    queryFn: () => getLessonsForCourse(slug as string),
  });

  const validLessonIndex = lessons?.some(
    l => l.lesson_index === parseInt(lessonIndex)
  );

  const hasNextLesson = lessons?.find((l) => l.lesson_index === parseInt(lessonIndex) + 1);

  const { data: lesson, isLoading: lessonLoading } = useQuery({
    queryKey: ['lesson', slug, lessonIndex],
    queryFn: () => getLessonForCourse(slug, parseInt(lessonIndex)),
    enabled: !!validLessonIndex, // only fetch if index is valid
  });

  useEffect(() => {
    if (!lesson || !lessons) return;

    // Only update when navigation is external (not from local router.push)
    if (!externalNavigationRef .current) {
      externalNavigationRef .current = true;
      return;
    }    
    const index = parseInt(lessonIndex);
    const progress = Math.floor(((index - 1)/ (lessons?.length || 0)) * 100);

    (async () => {
      await updateUserCourseProgress(lesson.course.documentId, progress, index, true);
      await queryClient.invalidateQueries({ queryKey: ['userCourses'] });
    })();    
  }, [lesson, lessons, lessonIndex, queryClient]);

  const onHandleCompleteLesson = () => {
    if (!lesson) return; // <- guard for TypeScript

    if (!hasNextLesson) {
      onEndCourse();
      return;
    }

    const progress = Math.floor((parseInt(lessonIndex) / (lessons?.length || 0)) * 100);

    (async () => {
      await markLessonAsCompleted(
        lesson.documentId,
        lesson.course.documentId,
        progress,
        parseInt(lessonIndex) + 1
      );

      await queryClient.invalidateQueries({ queryKey: ['lessons', slug] });
      await queryClient.invalidateQueries({ queryKey: ['userCourses'] });
    })();    

    // If there isn't a next lesson, simply stay on same lesson. This is a bug fix.
    // If required, later a better UI can be considered.
    if (hasNextLesson) {
      // mark that the next navigation is internal
      externalNavigationRef .current = false;
      router.push(`/course/${slug}/${parseInt(lessonIndex) + 1}`);
    }
  };

  useEventListener(player, 'playToEnd', () => {
    if (!isMounted) {
      // console.log('In playToEnd event handler. Ignoring spurious playToEnd event during mount');
      return;
    }
    onHandleCompleteLesson();
  });

  // Rendering
  if (lessonsLoading) {
    return (<LoadingView innerScreen={true} />);
  }

if (!validLessonIndex) {
  return (
    <View
      className={`flex-1 items-center justify-center ${
        colorScheme === 'dark' ? 'bg-black' : 'bg-white'
      }`}
    >
      <Text
        className={colorScheme === 'dark' ? 'text-white' : 'text-gray-800'}
      >
        Lesson not found
      </Text>
    </View>
  );
}

  if (!lesson) {
    return (<LoadingView innerScreen={true} />);
  }

  if (lesson?.video) {
    if (lastLessonIndexRef.current !== lessonIndex) {
      player.replace(lesson.video);
      // player.play(); // Does not autoplay on web; Not needed for Android
        // see [expo-video] Autoplay doesn't work for video on Web #36350, 
        // https://github.com/expo/expo/issues/36350
      lastLessonIndexRef.current = lessonIndex;
    } else {
      // console.log("Skipping replace, same lessonIndex", lessonIndex);
    }
  }
  // Automatically play the video in production
  // if (!__DEV__) {
  //   player.play();
  // }

  const onEndCourse = () => {
    confettiRef.current?.restart();
    (async () => {
      await markLessonAsCompleted(lesson.documentId, lesson.course.documentId, 100);
      await queryClient.invalidateQueries({ queryKey: ['lessons', slug] });
    })();    

    setTimeout(() => {
      router.replace(`/my-content`);
    }, Platform.OS === "web" ? 0 : 4000);
  };

  const hasNotes =
    lesson.notes &&
    Array.isArray(lesson.notes) &&
    lesson.notes.length > 0;

  if (!hasNotes) {
    console.log("Lesson notes are missing or empty for lesson:", lesson.documentId);
  }

  const videoHeight = isMobileWebLandscape ? '60%' : Platform.OS === 'web' ? '40%' : '30%';

  return (
    <ScrollView 
      contentContainerStyle={{
        flexGrow: 1,
        flexShrink: 1,  // <= crucial for web to prevent oversizing
        justifyContent: 'space-between', // pushes bottom button down if content is short
      }}
      style={{ flex: 1 }} // fills the parent height
      showsVerticalScrollIndicator={true}
    >
      {Platform.OS !== 'web' && (
        <Confetti
          ref={confettiRef}
          autoplay={false}
          fallDuration={8000}
          verticalSpacing={20}
          fadeOutOnEnd
        />
      )}

      <Stack.Screen options={{ title: lesson?.name || '' }} />
      <VideoView
        player={player}
        allowsFullscreen
        allowsPictureInPicture
        style={{ width: '100%', height: videoHeight }}
        // style={{ width: '100%', height: Platform.OS === 'web' ? '40%' : '30%' }}
        contentFit="contain"
      />

      <View className="flex-1 p-4 min-h-[100px]">
        {hasNotes ? (
          <RichtTextContent 
            colorScheme={colorScheme}
            blockContent={lesson.notes} 
          />
        ) : (
          <Text className="text-center text-gray-500 dark:text-gray-400">
            No notes available for this lesson.
          </Text>
        )}
      </View>
      {hasNextLesson && (
        <TouchableOpacity
          className="bg-primary py-3 flex-row items-center justify-center gap-2"
          onPress={onHandleCompleteLesson}>
          <Text className="text-center text-white font-medium">Complete & Next Lesson</Text>
          <Ionicons name="arrow-forward" size={24} color="white" />
        </TouchableOpacity>
      )}
      {!hasNextLesson && (
        <TouchableOpacity
          className="bg-primary py-3 flex-row items-center justify-center gap-2"
          onPress={onEndCourse}>
          <Text className="text-center text-white font-medium">Complete Course</Text>
          <Ionicons name="checkmark-circle-outline" size={24} color="white" />
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};
export default Page;
