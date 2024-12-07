import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";

import { UserContext } from "./user";

import { Student, getAllStudents } from "@/api/students";
import { StudentMap } from "@/components/StudentsTable/types";

type StudentsContext = {
  allStudents: StudentMap | undefined;
  isLoading: boolean;
  setAllStudents: React.Dispatch<React.SetStateAction<StudentMap | undefined>>;
};

export const StudentsContext = createContext<StudentsContext>({
  allStudents: undefined,
  setAllStudents: () => {},
  isLoading: true,
});

export const StudentsContextProvider = ({ children }: { children: ReactNode }) => {
  const [allStudents, setAllStudents] = useState<StudentMap | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const { firebaseUser } = useContext(UserContext);

  // Fetch Progress Notes and Students
  useEffect(() => {
    if (firebaseUser) {
      firebaseUser
        ?.getIdToken()
        .then((token) => {
          getAllStudents(token).then(
            (result) => {
              if (result.success) {
                const StudentsObject = result.data.reduce(
                  (obj, student) => {
                    obj[student._id] = student;
                    return obj;
                  },
                  {} as Record<string, Student>,
                );
                setAllStudents(StudentsObject);
                setIsLoading(false);
              }
            },
            (error) => {
              console.log(error);
              setIsLoading(false);
            },
          );
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [firebaseUser]);

  return (
    <StudentsContext.Provider value={{ allStudents, setAllStudents, isLoading }}>
      {children}
    </StudentsContext.Provider>
  );
};
