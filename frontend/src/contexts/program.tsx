import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";

import { UserContext } from "./user";

import { Program, getAllPrograms } from "@/api/programs";
import { ProgramMap } from "@/components/StudentsTable/types";


type ProgramsContext = {
  allPrograms: ProgramMap;
  isLoading: boolean;
  setAllPrograms: React.Dispatch<React.SetStateAction<ProgramMap>>;
};

export const ProgramsContext = createContext<ProgramsContext>({
  allPrograms: {},
  setAllPrograms: () => {},
  isLoading: true,
});

export const ProgramsContextProvider = ({ children }: { children: ReactNode }) => {
  const [allPrograms, setAllPrograms] = useState<ProgramMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseToken, setFirebaseToken] = useState<string>();
  const { firebaseUser } = useContext(UserContext);

  useEffect(() => {
    if (firebaseUser) {
      firebaseUser
        .getIdToken()
        .then((token) => {
          setFirebaseToken(token);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });

  useEffect(() => {
    if (firebaseToken) {
      getAllPrograms(firebaseToken).then(
        (result) => {
          if (result.success) {
            const programsObject = result.data.reduce(
              (obj, program) => {
                obj[program._id] = program;
                return obj;
              },
              {} as Record<string, Program>,
            );
            setAllPrograms(programsObject);
            setIsLoading(false);
          }
        },
        (error) => {
          console.log(error);
          setIsLoading(false);
        },
      );
    }
  }, [firebaseToken]);

  return (
    <ProgramsContext.Provider value={{ allPrograms, setAllPrograms, isLoading }}>
      {children}
    </ProgramsContext.Provider>
  );
};
