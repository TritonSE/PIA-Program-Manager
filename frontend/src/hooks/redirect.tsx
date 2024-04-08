import { User as FirebaseUser } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

import { User } from "@/api/user";
import { UserContext } from "@/contexts/user";

export const LOGIN_URL = "/login";
export const HOME_URL = "/home";
export const NOT_FOUND_URL = "/404-not-found";
export const NOT_APPROVED_URL = "/create_user_3";

/**
 * An interface for the user's current authentication credentials
 */
export type AuthCredentials = {
  firebaseUser: FirebaseUser | null;
  piaUser: User | null;
};

/**
 * A type for a function that determines whether the user should be redirected
 * based on their current credentials
 */
export type CheckShouldRedirect = (authCredentials: AuthCredentials) => boolean;

export type UseRedirectionProps = {
  checkShouldRedirect: CheckShouldRedirect;
  redirectURL: string;
};

/**
 * A base hook that redirects the user to redirectURL if checkShouldRedirect returns true
 */
export const useRedirection = ({ checkShouldRedirect, redirectURL }: UseRedirectionProps) => {
  const { firebaseUser, piaUser, loadingUser } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    // Don't redirect if we are still loading the current user
    if (loadingUser) {
      return;
    }

    if (checkShouldRedirect({ firebaseUser, piaUser })) {
      router.push(redirectURL);
    }
  }, [firebaseUser, piaUser, loadingUser]);
};

/**
 * A hook that redirects the user to the staff/admin home page if they are already signed in
 */
export const useRedirectToHomeIfSignedIn = () => {
  useRedirection({
    checkShouldRedirect: ({ firebaseUser, piaUser }) => firebaseUser !== null && piaUser !== null,
    redirectURL: HOME_URL,
  });
};

/**
 * A hook that redirects the user to the login page if they are not signed in
 */
export const useRedirectToLoginIfNotSignedIn = () => {
  useRedirection({
    checkShouldRedirect: ({ firebaseUser, piaUser }) => {
      console.log(firebaseUser);
      return firebaseUser === null || piaUser === null;
    },
    redirectURL: LOGIN_URL,
  });
};

/**
 * A hook that redirects the user to the 404 page if they are not an admin
 */
export const useRedirectTo404IfNotAdmin = () => {
  useRedirection({
    checkShouldRedirect: ({ firebaseUser, piaUser }) => firebaseUser === null || piaUser === null || piaUser.role !== 'admin',
    redirectURL: NOT_FOUND_URL,
  });
};

/**
 * A hook that redirects the user to the Not Approved page if they are not approved yet
 */
export const useRedirectToNotApproved = () => {
  useRedirection({
    checkShouldRedirect: ({ firebaseUser, piaUser }) => firebaseUser === null || piaUser === null || !piaUser.approvalStatus,
    redirectURL: NOT_FOUND_URL,
  });
};

