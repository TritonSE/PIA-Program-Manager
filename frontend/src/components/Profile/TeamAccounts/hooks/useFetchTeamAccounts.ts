import { User as FirebaseUser } from "firebase/auth";
import { Dispatch, SetStateAction, useEffect } from "react";

import { User, getAllTeamAccounts } from "@/api/user";

type UseFetchTeamAccounts = {
  firebaseUser: FirebaseUser | null;
  setFirebaseToken: Dispatch<SetStateAction<string>>;
  setAllAccounts: Dispatch<SetStateAction<User[]>>;
  setFilteredAccounts: Dispatch<SetStateAction<User[]>>;
};

export const useFetchTeamAccounts = ({
  firebaseUser,
  setFirebaseToken,
  setAllAccounts,
  setFilteredAccounts,
}: UseFetchTeamAccounts) => {
  useEffect(() => {
    if (firebaseUser) {
      firebaseUser
        ?.getIdToken()
        .then((token) => {
          getAllTeamAccounts(token).then(
            (result) => {
              setFirebaseToken(token);
              if (result.success) {
                console.log("Fetched all team accounts", result.data);
                setAllAccounts(result.data);
                setFilteredAccounts(result.data);
              } else {
                console.error(result.error);
              }
            },
            (error) => {
              console.error(error);
            },
          );
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [firebaseUser]);
};
