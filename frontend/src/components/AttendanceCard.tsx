import { Poppins } from "next/font/google";
import React from "react";
import { useForm } from "react-hook-form";

import { cn } from "../lib/utils";

import { Button } from "./Button";
import { Textfield } from "./Textfield";

const poppins = Poppins({ weight: ["400", "700"], style: "normal", subsets: [] });

export type CardProps = {
  programName: string;
  programType: "Varying" | "Regular";
  studentName: string;
};

export function AttendanceCard({ programName, programType, studentName }: CardProps) {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const _handleSubmit = handleSubmit;
  const _errors = errors;

  const outerDivClass = "grow overflow-hidden tracking-wide leading-6 bg-white rounded-lg w-56";
  const innerDivClass = "w-[200px] ml-auto mr-auto mt-0";
  const typeClass = cn(
    "relative text-[14px] top-2 left-3",
    programType === "Varying" ? "text-orange-500" : "text-[#4FA197]",
    poppins.className,
  );
  const titleClass = cn("capitalize relative text-sm top-2 left-3", poppins.className);
  const inputTitleClass = cn(
    "capitalize relative text-sm top-5 font-light text-pia_accent",
    poppins.className,
  );
  const optionsClass = "hover:cursor-pointer grid h-16 place-items-center mt-4";

  return (
    <div className={outerDivClass}>
      <div>
        <p className={typeClass}>
          {programName} ({programType})
        </p>
        <p className={titleClass}>{studentName}</p>
        <div className={innerDivClass}>
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
            name={"email"}
            label={""}
            disabled={programType === "Regular"}
            type="text"
            placeholder="0.0" // Default value later
            units="Hrs"
            registerOptions={{ required: "Email cannot be empty" }}
          />
          <div className={optionsClass}>
            <Button label="Mark Makeup" size="wide" />
          </div>
        </div>
      </div>
    </div>
  );
}
