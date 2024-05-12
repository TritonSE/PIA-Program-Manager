// useProgressNotes.js
import { User } from "firebase/auth";
import { useEffect, useState } from "react";

import { ProgressNote } from "../types";

import { getAllProgressNotes } from "@/api/progressNotes";

export const useProgressNotes = (firebaseUser: User | null) => {
  const [firebaseToken, setFirebaseToken] = useState("");
  const [allProgressNotes, setAllProgressNotes] = useState<
    Record<string, ProgressNote> | undefined
  >(undefined);

  useEffect(() => {
    if (firebaseUser) {
      firebaseUser
        ?.getIdToken()
        .then((token) => {
          setFirebaseToken(token);
          getAllProgressNotes(token).then(
            (result) => {
              if (result.success) {
                const sortedData = result.data.sort(
                  (a, b) =>
                    new Date(b.dateLastUpdated).getTime() - new Date(a.dateLastUpdated).getTime(),
                );
                const progressNotes = sortedData.reduce<Record<string, ProgressNote>>(
                  (obj, note) => {
                    obj[note._id] = note;
                    return obj;
                  },
                  {},
                );
                setAllProgressNotes(progressNotes);
              }
            },
            (error) => {
              console.log(error);
            },
          );
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [firebaseUser]);

  return { firebaseToken, allProgressNotes, setAllProgressNotes };
};
