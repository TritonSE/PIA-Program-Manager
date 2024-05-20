import { useContext, useMemo } from "react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";

import { Student } from "../../api/students";
import { cn } from "../../lib/utils";
import { Checkbox } from "../Checkbox";
import { ProgramsContext } from "../StudentsTable/StudentsTable";
import { Textfield } from "../Textfield";

import { convertDateToString } from "./StudentBackground";
import { StudentFormData } from "./types";

import { Program } from "@/api/programs";

type EnrollmentsEditProps = {
  register: UseFormRegister<StudentFormData>;
  classname?: string;
  setCalendarValue: UseFormSetValue<StudentFormData>;
  data: Student | null;
};

function EnrollmentsEdit({ register, classname, setCalendarValue, data }: EnrollmentsEditProps) {
  const programsMap = useContext(ProgramsContext);
  const allPrograms = useMemo(() => Object.values(programsMap), [programsMap]);
  if (!allPrograms) return null;

  return (
    <div className="grid w-full gap-5 lg:grid-cols-2">
      <div className="grid gap-y-5">
        <div>
          <h3>Regular Programs</h3>
          <Checkbox
            register={register}
            name="regular_programs"
            options={allPrograms
              .filter((prog) => prog.type === "regular")
              .slice(0, 2)
              .map((program: Program) => program.abbreviation)}
            defaultValue={data?.programs.map(
              (program) => programsMap[program.programId].abbreviation,
            )}
          />
        </div>
        <div>
          <h3>Varying Programs</h3>
          <Checkbox
            register={register}
            name="varying_programs"
            options={allPrograms
              .filter((prog) => prog.type === "varying")
              .slice(0, 2)
              .map((program: Program) => program.abbreviation)}
            defaultValue={data?.programs.map(
              (program) => programsMap[program.programId].abbreviation,
            )}
          />
        </div>
      </div>
    </div>
  );
}

export default EnrollmentsEdit;
