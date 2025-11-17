import { Course, Lesson, HomeInfo, StrapiUser, UserCourses } from '@/types/interfaces';
import { createContext, useContext, ReactNode } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { useQueryClient } from '@tanstack/react-query';
import { Alert, Platform } from 'react-native';

// Define the context type
interface StrapiContextType {
  createUser: (user: StrapiUser) => Promise<StrapiUser>;
  getHomeInfo: () => Promise<HomeInfo>;
  getCourses: () => Promise<Course[]>;
  getCourse: (slug: string) => Promise<Course>;
  getLessonsForCourse: (slug: string) => Promise<Lesson[]>;
  getLessonForCourse: (slug: string, lessonIndex: number) => Promise<Lesson>;
  getUserCourses: () => Promise<UserCourses[]>;
  addUserToCourse: (courseId: string) => Promise<UserCourses>;
  userHasCourse: (courseId: string) => Promise<boolean>;
  markLessonAsCompleted: (
    lessonId: string,
    courseId: string,
    progress: number,
    nextLessonIndex?: number
  ) => Promise<void>;
  updateUserCourseProgress: (
    courseId: string,
    progress: number,
    nextLessonIndex?: number,
    mapToUserCourse?: boolean  // optional, defaults to false
  ) => Promise<void>;      
  getUserCompletedLessons: () => Promise<number>;
}

const StrapiContext = createContext<StrapiContextType | undefined>(undefined);

export function StrapiProvider({ children }: { children: ReactNode }) {
  const baseUrl = process.env.EXPO_PUBLIC_STRAPI_API_URL as string;
  let backendMode: 'local' | 'cloud' | 'unknown';

  if (baseUrl.startsWith('https://')) {
    backendMode = 'cloud';
  } else if (baseUrl.startsWith('http://')) {
    backendMode = 'local';
  } else {
    backendMode = 'unknown';
  }

  console.log(`Strapi backendMode: ${backendMode}`);
  console.log(`Strapi API URL: ${baseUrl}`);

  const { user } = useUser();
  const queryClient = useQueryClient();

  const createUser = async (user: StrapiUser): Promise<StrapiUser> => {
    try {
      const response = await fetch(`${baseUrl}/api/auth/local/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  const getCourses = async (): Promise<Course[]> => {
    try {
      const response = await fetch(`${baseUrl}/api/courses?populate=image`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      result.data = result.data.map((item: any) => {
        const image = (__DEV__) && backendMode === 'local'
        ? `${baseUrl}${item.image.url}`  // In Development
        : `${item.image.url}`
        return {
          ...item,
          image,
        }
      });

      return result.data;
    } catch (error) {
      console.error('Error fetching data from Strapi:', error);
      throw error;
    }
  };

  const getCourse = async (slug: string): Promise<Course> => {
    try {
      const response = await fetch(`${baseUrl}/api/courses?filters[slug][$eq]=${slug}&populate=*`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      const image = (__DEV__) && backendMode === 'local'
       ? `${baseUrl}${result.data[0].image.url}`  // In Development
       : `${result.data[0].image.url}`

      result.data[0] = {
        ...result.data[0],
        image,
      };
      return result.data[0];
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
  };

  const getLessonsForCourse = async (slug: string): Promise<Lesson[]> => {
    try {
      const response = await fetch(
        `${baseUrl}/api/lessons?filters[course][slug][$eq]=${slug}&sort=lesson_index`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      const completedLessons = await getUserCompletedLessonsForCourse(slug);

      result.data.forEach((lesson: any) => {
        lesson.completed = completedLessons.includes(lesson.documentId);
      });

      return result.data;
    } catch (error) {
      console.error('Error fetching lessons for course:', error);
      throw error;
    }
  };

  const getLessonForCourse = async (slug: string, lessonIndex: number): Promise<Lesson> => {
    try {
      const response = await fetch(
        `${baseUrl}/api/lessons?filters[course][slug][$eq]=${slug}&filters[lesson_index][$eq]=${lessonIndex}&populate=*`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (!result.data[0]) {
        throw new Error(`No lesson found for slug "${slug}" and lessonIndex ${lessonIndex}`);
      }

      result.data[0].video = (__DEV__) && backendMode === 'local'
       ? `${baseUrl}${result.data[0].video.url}`  // In Development
       : `${result.data[0].video.url}`

      return result.data[0];
    } catch (error) {
      console.error('Error fetching lessons for course:', error);
      throw error;
    }
  };

  const getUserCompletedLessonsForCourse = async (slug: string): Promise<Lesson[]> => {
    try {
      const response = await fetch(
        `${baseUrl}/api/progresses?filters[course][slug][$eq]=${slug}&filters[clerkId][$eq]=${user?.id}&populate=lesson`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data.map((item: any) => item.lesson.documentId);
    } catch (error) {
      console.error('Error fetching user completed lessons for course:', error);
      throw error;
    }
  };

  const getHomeInfo = async (): Promise<HomeInfo> => {
    try {
      const response = await fetch(`${baseUrl}/api/home?populate=*`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      const image = (__DEV__) && backendMode === 'local'
       ? `${baseUrl}${result.data.image.url}`  // In Development
       : `${result.data.image.url}`

      result.data = {
        ...result.data,
        image,
      };
      return result.data;
    } catch (error) {
      throw error;
    }
  };

  const addUserToCourse = async (courseId: string): Promise<UserCourses> => {
    try {
      const body = {
        courseId,
        clerkId: user?.id,
      };

      let API_BASE = ''; // relative for web + all dev builds; Below override for native production builds
      if (!(__DEV__) && Platform.OS !== 'web'){
        if (!process.env.EXPO_PUBLIC_WEB_API_URL) {
          Alert.alert(
            "Configuration Error",
            "EXPO_PUBLIC_WEB_API_URL is missing. It has to be defined for Native production build"
          );
          throw new Error("EXPO_PUBLIC_WEB_API_URL is not defined. It has to be defined for Native production build.");
        }
        API_BASE = process.env.EXPO_PUBLIC_WEB_API_URL;
      }

      const url = `${API_BASE}/api/add-user-course`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await queryClient.invalidateQueries({ queryKey: ['userCourses'] });
      const result = await response.json();
      return result;
    } catch (error) {
      console.log("In addUserToCourse error handler with error:", error);
      console.log(error)
      throw error;
    }
  };

  const getUserCourses = async (): Promise<UserCourses[]> => {
    try {
      const url = `${baseUrl}/api/user-courses?filters[clerkId]=${user?.id}&populate[course][populate]=image`;
      const response = await fetch(encodeURI(url));

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      result.data.forEach((entry: any) => {
        entry.course.image = (__DEV__) && backendMode === 'local'
        ? `${baseUrl}${entry.course.image.url}`  // In Development
        : `${entry.course.image.url}`;
      });
      return result.data;
    } catch (error) {
      throw error;
    }
  };

  const userHasCourse = async (courseId: string): Promise<boolean> => {
    const userCourses = await getUserCourses();
    return userCourses.some((course) => course.course.documentId === courseId);
  };

  const markLessonAsCompleted = async (
    lessonId: string,
    courseId: string,
    progress: number,
    nextLessonIndex?: number
  ) => {
    try {
      const response = await fetch(`${baseUrl}/api/progresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            lesson: lessonId,
            course: courseId,
            clerkId: user?.id,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await response.body?.cancel(); // discard body efficiently      

      // Also update user-course with progress and lesson_index
      const userCourse = await getUserCourses();
      const userCourseToUpdate = userCourse.find((course) => course.course.documentId === courseId);
      if (userCourseToUpdate) {
        await updateUserCourseProgress(userCourseToUpdate.documentId, progress, nextLessonIndex);
      }
      await queryClient.invalidateQueries({ queryKey: ['userCourses'] });

      return;
      // return response.json();
    } catch (error) {
      throw error;
    }
  };

  const updateUserCourseProgress = async (
    courseId: string,
    progress: number,
    nextLessonIndex?: number,
    mapToUserCourse = false
  ) => {
    let userCourseId = courseId;

    if (mapToUserCourse) {
      try {
        const userCourses = await getUserCourses();
        const uc = userCourses.find((uc) => uc.course.documentId === courseId);
        if (!uc) {
          console.warn("No userCourse found for courseId:", courseId);
          return;
        }
        userCourseId = uc.documentId;
      } catch (err) {
        console.error("Failed to map courseId to userCourseId:", err);
        return;
      }
    }

    try {
      const response = await fetch(`${baseUrl}/api/user-courses/${userCourseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            finished_percentage: progress,
            next_lesson_index: `${nextLessonIndex}`,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.body?.cancel(); // discard body efficiently      
      // return response.json();
    } catch (error) {
      throw error;
    }
  };

  const getUserCompletedLessons = async (): Promise<number> => {
    try {
      const response = await fetch(
        `${baseUrl}/api/progresses?filters[clerkId]=${user?.id}&populate=lesson`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Filter out duplicate lessons by documentId
      const lessonIds = data.data.map((item: any) => item.lesson.documentId);
      const uniqueLessonIds = [...new Set(lessonIds)];
      return uniqueLessonIds.length;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    createUser,
    getCourses,
    getLessonsForCourse,
    getLessonForCourse,
    getHomeInfo,
    getUserCourses,
    addUserToCourse,
    getCourse,
    userHasCourse,
    markLessonAsCompleted,
    updateUserCourseProgress,    
    getUserCompletedLessons,
  };

  return <StrapiContext.Provider value={value}>{children}</StrapiContext.Provider>;
}

// Custom hook to use the Strapi context
export function useStrapi() {
  const context = useContext(StrapiContext);
  if (context === undefined) {
    throw new Error('useStrapi must be used within a StrapiProvider');
  }
  return context;
}
