import React, { createContext, useContext, useState } from "react";

type DummyAuthContextType = {
  dummyIsSignedIn: boolean;
  dummySignIn: () => void;
  dummySignOut: () => void;
};

const DummyAuthContext = createContext<DummyAuthContextType | null>(null);

export function DummyAuthProvider({ children }: { children: React.ReactNode }) {
  const [dummyIsSignedIn, setDummyIsSignedIn] = useState(false);

  const dummySignIn = () => {
    setDummyIsSignedIn(true);
  };

  const dummySignOut = () => {
    setDummyIsSignedIn(false);
  };

  return (
    <DummyAuthContext.Provider
      value={{
        dummyIsSignedIn,
        dummySignIn,
        dummySignOut,
      }}
    >
      {children}
    </DummyAuthContext.Provider>
  );
}

export function useDummyAuth() {
  const ctx = useContext(DummyAuthContext);
  if (!ctx) {
    throw new Error("useDummyAuth must be used within <DummyAuthProvider>");
  }
  return ctx;
}
