import Image from "next/image";
import { useContext, useMemo } from "react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";

import { Student } from "../../api/students";
import { cn } from "../../lib/utils";
import { Checkbox } from "../Checkbox";
import { ProgramsContext } from "../StudentsTable/StudentsTable";
import { Textfield } from "../Textfield";

import { convertDateToString } from "./StudentBackground";
import { StudentFormData } from "./types";

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
  const programsMap = useContext(ProgramsContext);
  const allPrograms = useMemo(() => Object.values(programsMap), [programsMap]);
  if (!allPrograms) return null;

  return (
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
      <div className="col-span-2">
        <h3>Incident Form</h3>
        <Textfield
          register={register}
          name="incident_form"
          placeholder="http://www.company.com"
          defaultValue={data?.incidentForm}
        />
      </div>
      <div className="col-span-2">
        <h3>UCI Number</h3>
        <Textfield
          register={register}
          name="uci_number"
          placeholder="123456"
          defaultValue={data?.UCINumber}
        />
      </div>
      <div className="col-span-2">
        <span className="align-center flex w-full justify-between">
          <h3>Documents</h3>
          <button
            className="flex gap-2"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Implement file upload
            }}
          >
            <Image src="../plus.svg" alt="edit profile picture" height="20" width="20" />
            <span className="leading-normal tracking-tight">Edit Image</span>
          </button>
        </span>
      </div>
    </div>
  );
}
