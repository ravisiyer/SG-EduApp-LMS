import { Redirect } from 'expo-router';

const Page = () => {
  const waitlistOn = process.env.EXPO_PUBLIC_CLERK_WAITLIST_ON === 'true';
  return <Redirect href={waitlistOn ? '/soon' : '/login'} />;
};

export default Page;
