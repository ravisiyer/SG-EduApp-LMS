import { View, Text, Button, Image, ScrollView } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useUser } from '@clerk/clerk-expo';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useStrapi } from '@/providers/StrapiProvider';

const Page = () => {
  const { signOut } = useAuth();
  const { user } = useUser();
  const { getUserCourses, getUserCompletedLessons } = useStrapi();
  const queryClient = useQueryClient();

  const { data: userCourses } = useQuery({
    queryKey: ['userCourses'],
    queryFn: () => getUserCourses(),
  });

  const { data: completedLessons } = useQuery({
    queryKey: ['userCompletedLessons'],
    queryFn: () => getUserCompletedLessons(),
  });

  const handleSignOut = async () => {
    await signOut();
    queryClient.clear();     // or queryClient.removeQueries()
  };

  return (
    <View className="flex-1 p-4">
      <ScrollView className="web:mx-auto">
        <View className="flex-row items-center mb-6">
          <Image source={{ uri: user?.imageUrl }} className="w-20 h-20 rounded-full mr-4" />
          <View className="flex-1">
            <Text className="text-md font-bold dark:text-white mb-1">
              {user?.primaryEmailAddress?.emailAddress}
            </Text>
            <Text className="text-base text-gray-600 dark:text-white">
              User since {new Date(user?.createdAt!).toDateString()}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-around mb-6 py-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
          <View className="items-center">
            <Text className="text-2xl font-bold dark:text-white mb-1">{userCourses?.length}</Text>
            <Text className="text-sm text-gray-600 dark:text-white">Courses</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold dark:text-white mb-1">{completedLessons}</Text>
            <Text className="text-sm text-gray-600 dark:text-white">Lessons</Text>
          </View>
        </View>

        <Button title="Sign Out" onPress={() => handleSignOut()} color="#FF3B30" />
      </ScrollView>
    </View>
  );
};

export default Page;
