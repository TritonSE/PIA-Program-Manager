import { Dot } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";

import { cn } from "../lib/utils";

import { Button } from "./Button";
import { StudentMap } from "./StudentsTable/types";
import { Textfield } from "./Textfield";

import { Program } from "@/api/programs";
import { useWindowSize } from "@/hooks/useWindowSize";

export type TableProps = {
  program: Program;
  students: StudentMap;
  date: Date;
};

export function AttendanceTable({ program, students, date }: TableProps) {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const _setValue = setValue;
  const _handleSubmit = handleSubmit;
  const _errors = errors;

  const dateObj = new Date(date.toString());
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthsOfYear = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const { isMobile, isTablet } = useWindowSize();

  console.log(students);
  return (
    <div className="relative w-[360px] overflow-x-auto bg-white shadow-md sm:rounded-lg md:w-[500px] lg:w-[1050px]">
      <div className="text-sm">
        <h1
          className={cn(
            program.type === "regular" ? "text-[#4FA197]" : "text-orange-500",
            "ml-5 mt-5 flex items-center",
          )}
        >
          {program.name} <Dot /> {program.type === "regular" ? "REGULAR" : "VARYING"} PROGRAM
        </h1>
        <h1 className="ml-5 mt-1 text-gray-400">
          {daysOfWeek[dateObj.getUTCDay()]}, {monthsOfYear[dateObj.getMonth()]} {dateObj.getDate()}{" "}
          from ...
        </h1>
      </div>
      <div className="mb-8 grid w-full overflow-x-auto text-left text-sm lg:grid-cols-2 rtl:text-right">
        {program.students.map((student, index) => {
          return (
            <div
              className={cn(
                "mr-5 flex grid grid-cols-3 bg-white",
                index < program.students.length - (2 - (program.students.length % 2)) && "border-b",
                index % 2 === 0 ? "ml-5" : "ml-5 lg:ml-10",
              )}
              key={index}
            >
              <div className={cn("p-5 pl-0", isMobile && "col-span-2")}>
                <div className="flex items-center">
                  <Image
                    src="/missingprofilepic.png"
                    className="mr-2 w-5 md:w-5"
                    alt=""
                    width="5"
                    height="5"
                  />
                  {students[student].student.firstName + " " + students[student].student.lastName}
                </div>
              </div>

              <div className="col-span-3 md:col-span-2 md:mt-2">
                <form className="flex grid grid-cols-3 items-center">
                  <Textfield
                    className={cn(
                      "mr-2 h-10 w-20",
                      !isMobile && "justify-self-end",
                      isMobile && "mb-2",
                    )}
                    register={register}
                    name={"email"}
                    label={""}
                    disabled={program.type === "Regular"}
                    type="text"
                    placeholder="0.0" // Default value later
                    unitsClassName="-translate-y-[3px]"
                    units="Hrs"
                    registerOptions={{ required: "Email cannot be empty" }}
                  />
                  <div
                    className={cn(
                      "col-span-2 ml-1 grid w-[210px] grid-cols-2 overflow-x-auto",
                      isMobile && "mb-2",
                    )}
                  >
                    <div>
                      <input
                        type="radio"
                        id={"attended_" + index}
                        name="presence"
                        value={"attended_" + index}
                        className="peer hidden"
                        defaultChecked
                      />
                      <label
                        htmlFor={"attended_" + index}
                        className="border-grey-300 inline-flex h-9 w-full cursor-pointer items-center justify-between rounded-l-lg border bg-white p-5 text-black hover:bg-gray-100 hover:text-gray-600 peer-checked:border-pia_dark_green peer-checked:bg-pia_dark_green peer-checked:text-white"
                      >
                        <div className="w-full text-sm">Attended</div>
                      </label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        id={"absent_" + index}
                        name="presence"
                        value={"absent_" + index}
                        className="peer hidden"
                      />
                      <label
                        htmlFor={"absent_" + index}
                        className="border-grey-300 inline-flex h-9 w-24 cursor-pointer items-center justify-between rounded-r-lg border bg-white p-5 pr-0 text-black hover:bg-gray-100 hover:text-gray-600 peer-checked:border-pia_dark_green peer-checked:bg-pia_dark_green peer-checked:text-white"
                      >
                        <div className="w-full text-sm">Absent</div>
                      </label>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          );
        })}
      </div>
      <div className={cn("grid w-full items-end md:grid-cols-2 lg:grid-cols-5")}>
        {!(isMobile || isTablet) && (
          <h1 className="col-span-2 mb-5 ml-5 inline-block align-bottom text-xs text-gray-400 lg:col-span-4">
            When you mark attendance for this session, each student’s calendar will be updated.
          </h1>
        )}
        <Button
          label="Mark Attendance"
          className={cn("mb-5 mr-5 md:col-start-2 lg:col-start-5", isMobile && "ml-5")}
          size="small"
        />
      </div>
    </div>
  );
}
