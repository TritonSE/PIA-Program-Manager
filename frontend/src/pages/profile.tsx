import { User as FirebaseUser } from "firebase/auth";
import React, { useContext } from "react";

import { User } from "@/api/user";
import PersonalInfo from "@/components/Profile/PersonalInfo/PersonalInfo";
import TeamAccounts from "@/components/Profile/TeamAccounts/TeamAccounts";
import { UserContext } from "@/contexts/user";
import { useRedirectToLoginIfNotSignedIn } from "@/hooks/redirect";

export type FrameProps = {
  className?: string;
  isMobile?: boolean;
  frameFormat?: string;
};

export type UserData = {
  piaUser: User | null;
  firebaseUser: FirebaseUser | null;
};

export default function Profile() {
  useRedirectToLoginIfNotSignedIn();

  const { piaUser, firebaseUser } = useContext(UserContext);
  const userData = { piaUser, firebaseUser };

  return (
    <div>
      <PersonalInfo userData={userData} />
      <TeamAccounts userData={userData} />
    </div>
  );
}
