import { Poppins } from "next/font/google";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { cn } from "../lib/utils";

import { Button } from "./Button";
import { Textfield } from "./Textfield";

import { Program } from "@/api/programs";
import { createAbsenceSession } from "@/api/sessions";
import { Student } from "@/api/students";

const poppins = Poppins({ weight: ["400", "700"], style: "normal", subsets: [] });

export type CardProps = {
  program: Program;
  student: Student;
  setRemainingSessions: Dispatch<SetStateAction<number>>;
};

export function AttendanceCard({ program, student, setRemainingSessions }: CardProps) {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const _errors = errors;

  const [marked, setMarked] = useState(false);
  const [closed, setClosed] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const clickedRef = useRef(false);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (clickedRef.current) return;
    clickedRef.current = true;
    const newAbsenceSession = {
      date: data.date,
      programId: program._id,
      student: { studentId: student._id, attended: true, hoursAttended: data.hoursAttended },
    };
    console.log(newAbsenceSession);
    createAbsenceSession(newAbsenceSession)
      .then((res) => {
        if (res.success) {
          console.log(res);
          setMarked(true);
          setTimeout(() => {
            setClosed(true);
            setRemainingSessions((val) => val - 1);
          }, 500);
        } else {
          setDisabled(false);
          alert(res.error);
        }
      })
      .catch((e) => {
        setDisabled(false);
        alert(e);
      });
  };

  const outerDivClass =
    "bg-white rounded-lg w-[240px] min-w-[240px] mr-[20px] h-[326px] flex-col transition-all default:opacity-0 opacity-100 duration-200 ease-in-out border border-gray";
  const innerDivClass = "w-[200px] ml-auto mr-auto mt-0 flex-col";
  const typeClass = cn(
    "relative text-[14px] top-2 left-3 capitalize",
    program.type === "varying" ? "text-orange-500" : "text-[#4FA197]",
    poppins.className,
  );
  const titleClass = cn("capitalize relative text-sm top-2 left-3 right-3", poppins.className);
  const inputTitleClass = cn(
    "capitalize relative text-sm top-5 font-light text-pia_accent",
    poppins.className,
  );
  const optionsClass = "hover:cursor-pointer grid h-16 place-items-center mt-4";

  return (
    <form
      className={cn(
        outerDivClass,
        marked && "opacity-0",
        closed && "mr-0 w-0 min-w-0 max-w-0 transition-none",
      )}
      onSubmit={handleSubmit(onSubmit)}
    >
      <p className={typeClass}>
        {program.name} ({program.type})
      </p>
      <p className={titleClass}>{student.student.firstName + " " + student.student.lastName}</p>
      <div className={cn(innerDivClass, closed && "mr-0 w-0 min-w-0 max-w-0")}>
        <p className={inputTitleClass}>Makeup Date</p>
        <Textfield
          className="mt-6"
          name="date"
          placeholder="00/00/00"
          register={register}
          calendar={true}
          setCalendarValue={setValue}
        />
        <p className={inputTitleClass}>Hours Present</p>
        <Textfield
          className="mt-6"
          register={register}
          name={"hoursAttended"}
          label={""}
          type="text"
          placeholder="0.0" // Default value later
          units="Hrs"
          registerOptions={{ required: "Email cannot be empty" }}
        />
        <div className={cn(optionsClass, closed && "mr-0 w-0 min-w-0 max-w-0")}>
          <Button
            label="Mark Makeup"
            size="wide"
            type="submit"
            disabled={disabled}
            onClick={() => {
              setDisabled(true);
            }}
          />
        </div>
      </div>
    </form>
  );
}
