"use client";

import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { ReactNode, createContext, useEffect, useState } from "react";

import { User, verifyUser } from "@/api/user";
import { initFirebase } from "@/firebase/firebase";

type IUserContext = {
  firebaseUser: FirebaseUser | null;
  piaUser: User | null;
  loadingUser: boolean;
  reloadUser: () => unknown;
};

/**
 * A context that provides the current Firebase and PAP (MongoDB) user data,
 * automatically fetching them when the page loads.
 */
export const UserContext = createContext<IUserContext>({
  firebaseUser: null,
  piaUser: null,
  loadingUser: true,
  reloadUser: () => {},
});

/**
 * A provider component that handles the logic for supplying the context
 * with its current user & loading state variables.
 */
export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [piaUser, setpiaUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const { auth } = initFirebase();

  /**
   * Callback triggered by Firebase when the user logs in/out, or on page load
   */
  onAuthStateChanged(auth, (user) => {
    setFirebaseUser(user);
    setInitialLoading(false);
  });

  const reloadUser = () => {
    if (initialLoading) {
      return;
    }
    setLoadingUser(true);
    setpiaUser(null);
    if (firebaseUser === null) {
      setLoadingUser(false);
    } else {
      firebaseUser
        .getIdToken()
        .then((token) =>
          verifyUser(token).then((res) => {
            if (res.success) {
              setpiaUser(res.data);
            } else {
              setpiaUser(null);
            }
            setLoadingUser(false);
          }),
        )
        .catch((error) => {
          console.error(error);
        });
    }
  };

  useEffect(reloadUser, [initialLoading, firebaseUser]);

  return (
    <UserContext.Provider value={{ firebaseUser, piaUser, loadingUser, reloadUser }}>
      {children}
    </UserContext.Provider>
  );
};
