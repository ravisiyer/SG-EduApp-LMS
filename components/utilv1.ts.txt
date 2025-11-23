import { useAuth, useUser } from '@clerk/clerk-expo';

// Ideally speaking we should be able to differentiate between user
// choosing a proper ClerkId (via Google SSO) or logging in as dummy.
// Should enhance below code later.

export function useRealOrDummyClerkUser() {
  const { user } = useUser();  
  if (process.env.EXPO_PUBLIC_DUMMY_LOGIN_ID) {
    return {
        id: process.env.EXPO_PUBLIC_DUMMY_LOGIN_ID,
        imageUrl: "",
        emailAddresses: [{emailAddress: "Dummy@dummy.com"}],
        primaryEmailAddress: {emailAddress: "Dummy@dummy.com"},
        createdAt: "1/1/2025"
        // primaryEmailAddress?.emailAddress
        // emailAddresses[0].emailAddress
    }
  } else {
    return user;
  }
}

export function useRealOrDummyIsSignedIn() {
  const { isSignedIn } = useAuth();
  if (process.env.EXPO_PUBLIC_DUMMY_LOGIN_ID) {
    return true;
  }
  return isSignedIn;
}

export function useRealOrDummyIsLoaded() {
  const { isLoaded } = useAuth();
  if (process.env.EXPO_PUBLIC_DUMMY_LOGIN_ID) {
    return true;
  }
  return isLoaded;
}

export function useRealOrDummyClerkSignOut() {
  const { signOut } = useAuth();

  async function doSignOut() {
    if (process.env.EXPO_PUBLIC_DUMMY_LOGIN_ID) {
      return Promise.resolve();
    } else {
      return signOut();
    }
  }
  return { signOut: doSignOut };
}