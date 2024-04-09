import { useEffect, useState } from "react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";

import { Student } from "../../api/students";
import { cn } from "../../lib/utils";
import { Checkbox } from "../Checkbox";
import { Textfield } from "../Textfield";

import { convertDateToString } from "./StudentBackground";
import { StudentFormData } from "./types";

import { Program, getAllPrograms } from "@/api/programs";

type StudentInfoProps = {
  register: UseFormRegister<StudentFormData>;
  classname?: string;
  setCalendarValue: UseFormSetValue<StudentFormData>;
  data: Student | null;
};

export default function StudentInfo({
  register,
  classname,
  setCalendarValue,
  data,
}: StudentInfoProps) {
  const [programs, setPrograms] = useState<Program[]>([]);

  useEffect(() => {
    getAllPrograms().then((result) => {
      if (result.success) {
        setPrograms(result.data);
      }
    });
  }, []);

  if (!programs) return null;

  return (
    <div className="grid w-full gap-5 lg:grid-cols-2">
      <div className={cn("grid flex-1 gap-x-3 gap-y-5 md:grid-cols-2", classname)}>
        <div>
          <h3>Intake date</h3>
          <Textfield
            register={register}
            name="intake_date"
            placeholder="00/00/0000"
            calendar={true}
            setCalendarValue={setCalendarValue}
            defaultValue={convertDateToString(data?.intakeDate)}
          />
        </div>
        <div>
          <h3>Tour date</h3>
          <Textfield
            register={register}
            name="tour_date"
            placeholder="00/00/0000"
            calendar={true}
            setCalendarValue={setCalendarValue}
            defaultValue={convertDateToString(data?.tourDate)}
          />
        </div>
      </div>
      <div className="grid gap-y-5">
        <div>
          <h3>Regular Programs</h3>
          <Checkbox
            register={register}
            name="regular_programs"
            options={programs
              .filter((prog) => prog.type === "regular")
              .slice(0, 2)
              .map((program: Program) => program.abbreviation)}
            defaultValue={data?.regularPrograms.map((program) => program.programId)}
          />
        </div>
        <div>
          <h3>Varying Programs</h3>
          <Checkbox
            register={register}
            name="varying_programs"
            options={programs
              .filter((prog) => prog.type === "varying")
              .slice(0, 2)
              .map((program: Program) => program.abbreviation)}
            defaultValue={data?.varyingPrograms.map((program) => program.programId)}
          />
        </div>
      </div>
    </div>
  );
}
