import { Text, View, Pressable, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useSSO } from '@clerk/clerk-expo';
import { useStrapi } from '@/providers/StrapiProvider';
import { randomUUID } from 'expo-crypto';

export default function Index() {
  const [loading, setLoading] = useState(false);
  const { startSSOFlow } = useSSO();
  const { createUser } = useStrapi();

  const handleSignInWithSSO = async (strategy: 'oauth_google' | 'oauth_apple') => {
    try {
      const { createdSessionId, setActive, signUp, signIn } = await startSSOFlow({ strategy });

      console.log(signUp, signIn);

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });

        // Only create Strapi user if this is a new signup
        // In debugging, I found that if user is only signing in, signUp is not null
        // but signUp.id is undefined and signUp.status (also _status) is null
        // https://clerk.com/docs/reference/javascript/sign-up#properties states that 
        // status 'complete' means:
        // The user has been created and the custom flow can proceed to setActive() to create session.
        //
        // I also had to change sign up mode in Clerk dashboard from waitlist to public.
        // After that, below code worked by differentiating correctly between new signup and existing user signin.
        // But this approach does not seem to be documented in Clerk docs.
        // The official approach seems to be more complicated which I want to skip for this tutorial.
        // For a production app, I will have to use an official approach provided in Clerk docs.
        if (signUp && signUp.status === 'complete') {
          const email = signUp.emailAddress;
          const username = email;
          const password = randomUUID();
          const id = signUp.createdUserId;

          console.log(email, username, password, id);

          if (!email || !username || !password || !id) {
            throw new Error('Missing required fields for new user signup.');
          }

          const strapiUser = { email, username, password, clerkId: id };
          await createUser(strapiUser);
        }
      }
    } catch (err) {
      console.log('SSO flow error:', err);
    }
  };

  return (
    <View className="flex-1 bg-[#132134] justify-center">
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <View className="w-full items-center gap-8 max-w-md mx-auto">
          <Image
            source={require('@/assets/images/intro.png')}
            style={{
              width: '100%',
              height: 400,
              aspectRatio: 1,
            }}
            resizeMode="contain"
          />
          <Text className="text-3xl font-bold text-white mb-2">Your journey starts here</Text>

          <View className="w-full gap-4 px-4">
            {/* <Pressable
              className="w-full flex-row justify-center items-center bg-white py-3 rounded-lg hover:cursor-pointer hover:bg-gray-800 duration-300"
              onPress={() => handleSignInWithSSO('oauth_apple')}
              >
              <Ionicons name="logo-apple" size={24} color="black" className="mr-2" />
              <Text className="text-black text-center font-semibold ml-2">Continue with Apple</Text>
            </Pressable> */}

            <Pressable
              className="w-full flex-row justify-center items-center bg-white py-3 rounded-lg hover:cursor-pointer hover:bg-gray-800 duration-300"
              onPress={() => handleSignInWithSSO('oauth_google')}
              >
              <Ionicons name="logo-google" size={24} color="black" className="mr-2" />
              <Text className="text-black text-center font-semibold ml-2">
                Continue with Google
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}
