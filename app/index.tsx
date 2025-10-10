import { Redirect } from 'expo-router';

const Page = () => {
  const waitlistOn = process.env.EXPO_PUBLIC_CLERK_WAITLIST_ON === 'true';
  return <Redirect href={waitlistOn ? '/soon' : '/login'} />;
  // if (process.env.CLERK_WAITLIST_ON === 'true') {
  //   return <Redirect href="/soon" />;
  // } else {
  //   return <Redirect href="/login" />;
  // }
};

export default Page;
