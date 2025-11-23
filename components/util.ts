import { useAuth, useUser } from "@clerk/clerk-expo";
import { useDummyAuth } from "@/providers/DummyAuthContext";

export function useRealOrDummyClerkUser() {
  const { user } = useUser();
  const { dummyIsSignedIn } = useDummyAuth();

  const dummyEnabled = Boolean(process.env.EXPO_PUBLIC_DUMMY_LOGIN_ID);

  if (dummyEnabled && dummyIsSignedIn) {
    return {
      id: process.env.EXPO_PUBLIC_DUMMY_LOGIN_ID,
      imageUrl: "",
      emailAddresses: [{ emailAddress: "mail@dummymail.com" }],
      primaryEmailAddress: { emailAddress: "mail@dummymail.com" },
      createdAt: "2025-01-01",
    };
  }

  return user;
}

export function useRealOrDummyIsSignedIn() {
  const { isSignedIn } = useAuth();
  const { dummyIsSignedIn } = useDummyAuth();
  const dummyEnabled = Boolean(process.env.EXPO_PUBLIC_DUMMY_LOGIN_ID);

  return isSignedIn || (dummyEnabled && dummyIsSignedIn);
}

export function useRealOrDummyIsLoaded() {
  const { isLoaded } = useAuth();
  const { dummyIsSignedIn } = useDummyAuth();
  const dummyEnabled = Boolean(process.env.EXPO_PUBLIC_DUMMY_LOGIN_ID);

  // Loaded if Clerk loaded OR (dummy enabled and dummy signed in)
  return isLoaded || (dummyEnabled && dummyIsSignedIn);
}

export function useRealOrDummyClerkSignOut() {
  const { signOut } = useAuth();
  const { dummyIsSignedIn, dummySignOut } = useDummyAuth();
  const dummyEnabled = Boolean(process.env.EXPO_PUBLIC_DUMMY_LOGIN_ID);

  async function doSignOut() {
    if (dummyEnabled && dummyIsSignedIn) {
      dummySignOut();
      return Promise.resolve();
    }
    return signOut();
  }

  return { signOut: doSignOut };
}
