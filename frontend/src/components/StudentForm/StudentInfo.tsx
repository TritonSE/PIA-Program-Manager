import Image from "next/image";
import { useContext, useMemo } from "react";
import { useFormContext } from "react-hook-form";

import { Student } from "../../api/students";
import { cn } from "../../lib/utils";
import { Textfield } from "../Textfield";

import { convertDateToString } from "./StudentBackground";
import { StudentFormData } from "./types";

import { ProgramsContext } from "@/contexts/program";

type StudentInfoProps = {
  classname?: string;
  data: Student | null;
};

export default function StudentInfo({ classname, data }: StudentInfoProps) {
  const { register, setValue: setCalendarValue } = useFormContext<StudentFormData>();

  const { allPrograms: programsMap } = useContext(ProgramsContext);
  const allPrograms = useMemo(() => Object.values(programsMap), [programsMap]);
  if (!allPrograms) return null;

  return (
    <div className={cn("grid flex-1 gap-x-8 gap-y-10 md:grid-cols-2", classname)}>
      <div>
        <h3 className="mb-5">Intake date</h3>
        <Textfield
          register={register}
          name="intakeDate"
          placeholder="00/00/0000"
          calendar={true}
          setCalendarValue={setCalendarValue}
          defaultValue={convertDateToString(data?.intakeDate)}
        />
      </div>
      <div>
        <h3 className="mb-5">Tour date</h3>
        <Textfield
          register={register}
          name="tourDate"
          placeholder="00/00/0000"
          calendar={true}
          setCalendarValue={setCalendarValue}
          defaultValue={convertDateToString(data?.tourDate)}
        />
      </div>
      <div className="col-span-2">
        <h3 className="mb-5 w-full text-left text-lg font-bold">Incident Form</h3>
        <Textfield
          register={register}
          name="incidentForm"
          placeholder="http://www.company.com"
          defaultValue={data?.incidentForm}
        />
      </div>
      <div className="col-span-2">
        <h3 className="mb-5 w-full text-left text-lg font-bold">UCI Number</h3>
        <Textfield
          register={register}
          name="UCINumber"
          placeholder="123456"
          defaultValue={data?.UCINumber}
        />
      </div>
      <div className="col-span-2">
        <span className="align-center flex w-full justify-between">
          <h3 className="mb-5 text-left text-lg font-bold">Documents</h3>
          <button
            className="flex w-fit gap-2"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Implement file upload
            }}
          >
            <Image src="/plus.svg" alt="Edit Document" height="20" width="20" />
            <span className="whitespace-nowrap leading-normal tracking-tight">Add Document</span>
          </button>
        </span>
      </div>
    </div>
  );
}
