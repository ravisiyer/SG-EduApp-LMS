import { View, Text, TouchableOpacity, ActivityIndicator, Platform, useColorScheme } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useStrapi } from '@/providers/StrapiProvider';
import RichtTextContent from '@/components/RichtTextContent';
import { useEventListener } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { Confetti, ConfettiMethods } from 'react-native-fast-confetti';
import { useEffect, useRef, useState } from 'react';

const Page = () => {
  const colorScheme = useColorScheme() as 'light' | 'dark';
  const { slug, lesson: lessonIndex } = useLocalSearchParams<{ slug: string; lesson: string }>();
  const { getLessonForCourse, markLessonAsCompleted, getLessonsForCourse } = useStrapi();
  const player = useVideoPlayer(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const confettiRef = useRef<ConfettiMethods>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Give the player a short time to settle before we start reacting to events
    const timer = setTimeout(() => setIsMounted(true), 500);
    return () => clearTimeout(timer);
    // setIsMounted(true)
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

  const onHandleCompleteLesson = () => {
    console.log("Entered onHandleCompleteLesson");
    if (!lesson) return; // <- guard for TypeScript
    const progress = Math.floor((parseInt(lessonIndex) / (lessons?.length || 0)) * 100);

    console.log("Invoking markLessonAsCompleted with:", {
      lessonId: lesson.documentId,
      courseId: lesson.course.documentId,
      progress,
      nextLessonIndex: parseInt(lessonIndex) + 1
    });
    markLessonAsCompleted(
      lesson.documentId,
      lesson.course.documentId,
      progress,
      parseInt(lessonIndex) + 1
    );

    queryClient.invalidateQueries({ queryKey: ['lessons', slug] });
    queryClient.invalidateQueries({ queryKey: ['userCourses'] });
    // If there isn't a next lesson, simply stay on same lesson. This is a bug fix.
    // If required, later a better UI can be considered.
    if (hasNextLesson) {router.push(`/course/${slug}/${parseInt(lessonIndex) + 1}`);}
  };

  useEventListener(player, 'playToEnd', () => {
    if (!isMounted) {
      console.log('Ignoring spurious playToEnd event during mount');
      return;
    }
    console.log("isMounted is true in playToEnd event handler. Will now invoke onHandleCompleteLesson.");
    onHandleCompleteLesson();
  });

  // Rendering
  if (lessonsLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color="#0d6c9a" />
      </View>
    );
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
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color="#0d6c9a" />
      </View>
    );
  }

  if (lesson?.video) {
    player.replace(lesson.video);
  }

  // player.replace(lesson.video);

  // Automatically play the video in production
  // if (!__DEV__) {
  //   player.play();
  // }

  const onEndCourse = () => {
    confettiRef.current?.restart();
    markLessonAsCompleted(lesson.documentId, lesson.course.documentId, 100);
    queryClient.invalidateQueries({ queryKey: ['lessons', slug] });

    setTimeout(() => {
      router.replace(`/my-content`);
    }, Platform.OS === "web" ? 0 : 4000);
    // }, 4000);
  };

  const hasNotes =
    lesson.notes &&
    Array.isArray(lesson.notes) &&
    lesson.notes.length > 0;

  if (!hasNotes) {
    console.log("Lesson notes are missing or empty for lesson:", lesson.documentId);
  }

  return (
    <View className="flex-1">
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
        style={{ width: '100%', height: Platform.OS === 'web' ? '40%' : '30%' }}
        contentFit="contain"
      />

      {/* <View className="flex-1 p-4 min-h-[100px]">
        <RichtTextContent 
          colorScheme={colorScheme}
          blockContent={lesson.notes} 
        />
      </View> */}
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
          className="bg-primary py-3 flex-row items-center justify-center pb-safe gap-2"
          onPress={onHandleCompleteLesson}>
          <Text className="text-center text-white font-medium">Complete & Next Lesson</Text>
          <Ionicons name="arrow-forward" size={24} color="white" />
        </TouchableOpacity>
      )}
      {!hasNextLesson && (
        <TouchableOpacity
          className="bg-primary py-3 flex-row items-center justify-center pb-safe gap-2"
          onPress={onEndCourse}>
          <Text className="text-center text-white font-medium">Complete Course</Text>
          <Ionicons name="checkmark-circle-outline" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};
export default Page;
