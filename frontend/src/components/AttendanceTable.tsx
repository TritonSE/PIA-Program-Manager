import { Dot } from "lucide-react";
import Image from "next/image";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { cn } from "../lib/utils";

import { Button } from "./Button";
import { StudentMap } from "./StudentsTable/types";
import { Textfield } from "./Textfield";

import { Program } from "@/api/programs";
import { Session, updateSession } from "@/api/sessions";
import { useWindowSize } from "@/hooks/useWindowSize";
import { AbsenceSessions } from "@/pages/attendance";

export type TableProps = {
  program: Program;
  session: Session;
  students: StudentMap;
  setRemainingSessions: Dispatch<SetStateAction<number>>;
  setAllAbsenceSessions: Dispatch<SetStateAction<AbsenceSessions>>;
  setRemainingAbsenceSessions: Dispatch<SetStateAction<number>>;
  firebaseToken: string;
};

export function AttendanceTable({
  program,
  session,
  students,
  setRemainingSessions,
  setAllAbsenceSessions,
  setRemainingAbsenceSessions,
  firebaseToken,
}: TableProps) {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const _setValue = setValue;
  const _errors = errors;

  const dateObj = new Date(session.date.toString());

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

  const [marked, setMarked] = useState(false);
  const [closed, setClosed] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const clickedRef = useRef(false);

  const { isMobile, isTablet } = useWindowSize();

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (clickedRef.current) return;
    clickedRef.current = true;
    const studentInfo = session.students.map((student) => {
      return {
        studentId: student.studentId,
        attended: data["attended_" + student.studentId] === "true" ? true : false,
        hoursAttended: data["hoursAttended_" + student.studentId],
      };
    });
    session.students = studentInfo;
    session.marked = true;
    updateSession(session, firebaseToken)
      .then((newSession) => {
        if (newSession.success) {
          const absentStudents = newSession.data.students.filter((student) => !student.attended);

          const newAbsences: AbsenceSessions = absentStudents.map((student) => ({
            studentId: student.studentId,
            programId: program._id,
          }));

          setAllAbsenceSessions((absenceSessions) => [...absenceSessions, ...newAbsences]);

          setRemainingAbsenceSessions(
            (remainingSessions) => remainingSessions + newAbsences.length,
          );

          setMarked(true);
          setTimeout(() => {
            setClosed(true);
            setRemainingSessions((val) => val - 1);
          }, 500);
        } else {
          setDisabled(false);
          alert("Unable to mark session: " + newSession.error);
        }
      })
      .catch((e) => {
        setDisabled(false);
        alert(e);
      });
  };

  return (
    <div
      className={cn(
        "mt-[20px] opacity-100 transition-all duration-200 ease-in-out",
        marked && "translate-x-[50px] opacity-0",
        closed && "mt-0 h-0 max-h-0 transition-none",
      )}
    >
      <form
        className={cn(
          "border-gray relative w-[360px] overflow-x-auto border bg-white shadow-md sm:rounded-lg md:w-[500px] lg:w-[1050px]",
        )}
        onSubmit={handleSubmit(onSubmit)}
      >
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
            {daysOfWeek[dateObj.getUTCDay()]}, {monthsOfYear[dateObj.getMonth()]}{" "}
            {dateObj.getUTCDate()}{" "}
            {program.type === "regular" &&
              "from " + session.sessionTime.start_time + "to " + session.sessionTime.end_time}
          </h1>
        </div>
        <div className="mb-8 grid w-full overflow-x-auto text-left text-sm lg:grid-cols-2 rtl:text-right">
          {session.students.map((student, index) => {
            return (
              <div
                className={cn(
                  "mr-5 flex grid grid-cols-3 bg-white",
                  index < session.students.length - (2 - (session.students.length % 2)) &&
                    "border-b",
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
                    {students[student.studentId].student.firstName +
                      " " +
                      students[student.studentId].student.lastName}
                  </div>
                </div>

                <div className="col-span-3 md:col-span-2 md:mt-2">
                  <div className="flex grid grid-cols-3 items-center">
                    <Textfield
                      className={cn(
                        "mr-2 h-10 w-20",
                        !isMobile && "justify-self-end",
                        isMobile && "mb-2",
                      )}
                      register={register}
                      name={"hoursAttended_" + student.studentId}
                      label={""}
                      disabled={program.type === "Regular"}
                      type="text"
                      placeholder="0.0" // Default value later
                      defaultValue={student.hoursAttended.toString()}
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
                          {...register("attended_" + student.studentId)}
                          type="radio"
                          id={
                            session.programId +
                            session.date.toString() +
                            session.sessionTime.start_time +
                            session.sessionTime.end_time +
                            "attended_" +
                            student.studentId
                          }
                          name={"attended_" + student.studentId}
                          value={"true"}
                          className="peer hidden"
                          defaultChecked
                        />
                        <label
                          htmlFor={
                            session.programId +
                            session.date.toString() +
                            session.sessionTime.start_time +
                            session.sessionTime.end_time +
                            "attended_" +
                            student.studentId
                          }
                          className="border-grey-300 inline-flex h-9 w-full cursor-pointer items-center justify-between rounded-l-lg border bg-white p-5 text-black hover:bg-gray-100 hover:text-gray-600 peer-checked:border-pia_dark_green peer-checked:bg-pia_dark_green peer-checked:text-white"
                        >
                          <div className="w-full text-sm">Attended</div>
                        </label>
                      </div>
                      <div>
                        <input
                          {...register("attended_" + student.studentId)}
                          type="radio"
                          id={
                            session.programId +
                            session.date.toString() +
                            session.sessionTime.start_time +
                            session.sessionTime.end_time +
                            "absent_" +
                            student.studentId
                          }
                          name={"attended_" + student.studentId}
                          value={"false"}
                          className="peer hidden"
                        />
                        <label
                          htmlFor={
                            session.programId +
                            session.date.toString() +
                            session.sessionTime.start_time +
                            session.sessionTime.end_time +
                            "absent_" +
                            student.studentId
                          }
                          className="border-grey-300 inline-flex h-9 w-24 cursor-pointer items-center justify-between rounded-r-lg border bg-white p-5 pr-0 text-black hover:bg-gray-100 hover:text-gray-600 peer-checked:border-pia_dark_green peer-checked:bg-pia_dark_green peer-checked:text-white"
                        >
                          <div className="w-full text-sm">Absent</div>
                        </label>
                      </div>
                    </div>
                  </div>
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
            type="submit"
            disabled={disabled}
            onClick={() => {
              setDisabled(true);
            }}
          />
        </div>
      </form>
    </div>
  );
}
