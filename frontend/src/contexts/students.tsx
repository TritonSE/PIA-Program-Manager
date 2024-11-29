import React, { ReactNode, createContext, useEffect, useState } from "react";

import { Student, getAllStudents } from "@/api/students";
import { StudentMap } from "@/components/StudentsTable/types";

type StudentsContext = {
  allStudents: StudentMap;
  isLoading: boolean;
  setAllStudents: React.Dispatch<React.SetStateAction<StudentMap>>;
};

export const StudentsContext = createContext<StudentsContext>({
  allStudents: {},
  setAllStudents: () => {},
  isLoading: true,
});

export const StudentsContextProvider = ({ children }: { children: ReactNode }) => {
  const [allStudents, setAllStudents] = useState<StudentMap>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllStudents().then(
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
  }, []);

  return (
    <StudentsContext.Provider value={{ allStudents, setAllStudents, isLoading }}>
      {children}
    </StudentsContext.Provider>
  );
};
