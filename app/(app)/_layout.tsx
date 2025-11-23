import { Redirect, Slot, useSegments } from 'expo-router';
// import { useAuth } from '@clerk/clerk-expo';
import { RevenueCatProvider } from '@/providers/RevenueCatProvider';
import { useRealOrDummyIsSignedIn } from '@/components/util';

const Layout = () => {
  console.log('Rendering App Layout: (app)');

  // const { isSignedIn } = useAuth();
  const isSignedIn = useRealOrDummyIsSignedIn();
  const segments = useSegments();
  const inAuthGroup = segments[1] === '(authenticated)';

  console.log(`App Layout: (app): isSignedIn=${isSignedIn}, inAuthGroup=${inAuthGroup}, segments=${segments.join(',')}  `);
  // Protect the inside area
  if (!isSignedIn && inAuthGroup) {
    console.log('App Layout: (app): redirecting to /login');
    return <Redirect href="/login" />;
  }

  return (
    <RevenueCatProvider>
      <Slot />
    </RevenueCatProvider>
  );
};

export default Layout;
