import React, { ReactNode, createContext, useEffect, useState } from "react";

import { Program, getAllPrograms } from "@/api/programs";
import { ProgramMap } from "@/components/StudentsTable/types";

type ProgramContext = {
  allPrograms: ProgramMap;
  loading: boolean;
  setAllPrograms: React.Dispatch<React.SetStateAction<ProgramMap>>;
};

export const ProgramsContext = createContext<ProgramContext>({
  allPrograms: {},
  setAllPrograms: () => {},
  loading: true,
});

export const ProgramsContextProvider = ({ children }: { children: ReactNode }) => {
  const [allPrograms, setAllPrograms] = useState<ProgramMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPrograms().then(
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
          setLoading(false);
        }
      },
      (error) => {
        console.log(error);
        setLoading(false);
      },
    );
  }, []);

  return (
    <ProgramsContext.Provider value={{ allPrograms, setAllPrograms, loading }}>
      {children}
    </ProgramsContext.Provider>
  );
};
