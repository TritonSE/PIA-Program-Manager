import Image from "next/image";
import { useContext, useEffect, useMemo } from "react";
import {
  Controller,
  UseFieldArrayRemove,
  UseFormRegister,
  UseFormSetValue,
  useFieldArray,
} from "react-hook-form";

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
  control: any;
};

export const emptyEnrollment = {
  studentId: "",
  programId: "",
  status: "",
  dateUpdated: new Date(),
  hoursLeft: 0,
  schedule: "",
  sessionTime: [] as string[],
  startDate: new Date(),
  renewalDate: new Date(),
  authNumber: "",
};

function EnrollmentsEdit({
  register,
  classname,
  setCalendarValue,
  data,
  control,
}: EnrollmentsEditProps) {
  const programsMap = useContext(ProgramsContext);
  const allPrograms = useMemo(() => Object.values(programsMap), [programsMap]);

  const { fields, remove, append } = useFieldArray({
    control,
    name: "enrollments",
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  if (!allPrograms) return null;

  return (
    <div className="grid w-full gap-5 lg:grid-cols-2">
      <div className="grid gap-y-5">
        <span className="align-center flex w-full justify-between">
          <h3>Regular Programs</h3>
          <button
            className="flex gap-2"
            onClick={(e) => {
              e.preventDefault();
              append(emptyEnrollment);
            }}
          >
            <Image src="../plus.svg" alt="edit profile picture" height="20" width="20" />
            <span className="leading-normal tracking-tight">Add Program</span>
          </button>
        </span>
        <ul>
          {fields.map((item, index) => {
            return (
              <li key={item.id}>
                <EnrollmentFormItem register={register} data={data} index={index} remove={remove} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

const EnrollmentFormItem = ({
  register,
  data,
  index,
  remove,
}: {
  register: UseFormRegister<StudentFormData>;
  data: Student | null;
  index: number;
  remove: UseFieldArrayRemove;
}) => {
  return (
    <>
      <div className="col-span-2">
        <h3>Program Name</h3>
        <Textfield
          register={register}
          name={`enrollments.${index}.programId`}
          placeholder="Specify"
          defaultValue={data?.enrollments[index].programId}
        />
      </div>
      <button
        type="button"
        onClick={() => {
          remove(index);
        }}
      >
        Delete
      </button>
    </>
  );
};

export default EnrollmentsEdit;
