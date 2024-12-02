import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useMemo, useState } from "react";

import { Enrollment, Program, getProgram, getProgramEnrollments } from "../api/programs";
import { UserContext } from "../contexts/user";
import { useWindowSize } from "../hooks/useWindowSize";
import { cn } from "../lib/utils";

import { ProgramProfileTable } from "./ProgramProfileTable";
import { StudentMap } from "./StudentsTable/types";

import { getAllStudents } from "@/api/students";

const poppins = Poppins({ weight: ["400", "700"], style: "normal", subsets: [] });

export type ProgramProfileProps = {
  id: string;
};

export function ProgramProfile({ id }: ProgramProfileProps) {
  const { windowSize } = useWindowSize();
  const isMobile = useMemo(() => windowSize.width < 640, [windowSize.width]);
  const isTablet = useMemo(() => windowSize.width < 1024, [windowSize.width]);

  const [program, setProgram] = useState<Program>();
  const [fillerText, setFillerText] = useState<string>("Loading");
  const [enrollments, setEnrollments] = useState<[Enrollment]>();
  const [allStudents, setAllStudents] = useState<StudentMap>({});
  const [firebaseToken, setFirebaseToken] = useState<string>();
  const { firebaseUser } = useContext(UserContext);

  useEffect(() => {
    if (firebaseUser) {
      firebaseUser
        .getIdToken()
        .then((token) => {
          setFirebaseToken(token);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [firebaseUser]);

  useEffect(() => {
    if (!firebaseToken) return;

    getProgram(id, firebaseToken).then(
      (result) => {
        if (result.success) {
          setProgram(result.data);
          console.log("Program Found");
        } else {
          setFillerText("No Program Found");
          console.log(fillerText);
        }
      },
      (error) => {
        console.log(error);
      },
    );
    getProgramEnrollments(id, firebaseToken).then(
      (result) => {
        if (result.success) {
          setEnrollments(result.data);
          console.log("Enrollments Found");
        } else {
          console.log("Enrollments Not Found");
        }
      },
      (error) => {
        console.log(error);
      },
    );
    getAllStudents(firebaseToken).then(
      (result) => {
        if (result.success) {
          // Convert student array to object with keys as ids and values as corresponding student
          const studentsObject = result.data.reduce((obj, student) => {
            obj[student._id] = student;
            return obj;
          }, {} as StudentMap);

          setAllStudents(studentsObject);
        } else {
          console.log(result.error);
        }
      },
      (error) => {
        console.log(error);
      },
    );
  }, [firebaseToken]);

  let headerClass = "bg-pia_primary_light_green  text-secondary_teal";
  let titleClass = "font-bold";
  let detailsClass = "relative flex flex-row flex-wrap font-normal";
  let iconClass = "";
  let iconHeight = 12;
  let iconWidth = 18;
  let messageClass = "relative font-normal text-wrap grow-0";
  const middleDivClass = "relative top-0 grow w-full h-1";
  let outerTableClass = "h-full w-full px-10";
  let innerTableClass =
    "h-full overflow-scroll no-scrollbar rounded border-pia_neutral_gray border-[1px]";
  let bottomDivClass = "";

  if (isTablet) {
    headerClass += " h-auto pb-8 text-[18px] leading-[27px]";
    detailsClass += " top-2 text-[12px] leading-[16px] gap-2";
    iconClass += " py-[3px] pl-2";
    iconHeight = 10;
    iconWidth = 16;
    messageClass += " pt-[32px] pb-[12px]";
    outerTableClass += " overflow-x-scroll no-scrollbar";
    innerTableClass += " w-[844px]";
    bottomDivClass += "h-[40px]";
    if (isMobile) {
      headerClass += " pt-[36px] px-[16px]";
      messageClass += " px-[24px] text-[12px] leading-[16px]";
    } else {
      headerClass += " pt-6 px-12";
      messageClass += " px-[48px] text-[12px] leading-[16px]";
    }
  } else {
    headerClass += " h-[154px] p-10 text-[28px] leading-[42px]";
    detailsClass += " top-0.5 text-[16px] leading-[24px] gap-x-4";
    iconClass += " p-1.5";
    messageClass += " pt-[32px] pb-[12px] px-[40px] text-[16px] leading-[24px]";
    bottomDivClass += "h-[112px]";
  }

  function isVarying(type: string) {
    return type === "varying";
  }

  function reformatDays(days: string[]) {
    let output: string = days[0];
    for (let i = 1; i < days.length; i++) {
      output += "/" + days[i];
    }
    return output;
  }

  function getStudentNum(num: number): string {
    if (num === 1) {
      return "1 student";
    } else {
      return num + " students";
    }
  }

  titleClass = cn(titleClass, poppins.className);
  return (
    <div className="flex h-full flex-col">
      <div className={headerClass}>
        {program && (
          <div>
            <h1 className={titleClass}>{program.name}</h1>
            <div className={detailsClass}>
              <p>{program.type.toUpperCase()} PROGRAM</p>
              {!isVarying(program.type) && !isTablet && <p> • </p>}
              {!isVarying(program.type) && !isTablet && <p>{reformatDays(program.daysOfWeek)}</p>}
              <p> • </p>
              <div className="flex flex-row">
                {isTablet && enrollments && <p>{getStudentNum(enrollments.length)}</p>}
                <div className={iconClass}>
                  <Image
                    alt="students"
                    src="/programs/GreenStudents.png"
                    height={iconHeight}
                    width={iconWidth}
                  />
                </div>
                {!isTablet && enrollments && <p>{getStudentNum(enrollments.length)}</p>}
              </div>
              <p> • </p>
              <p>${program.hourlyPay}/hour</p>
            </div>
          </div>
        )}
        {!program && <p>{fillerText}</p>}
      </div>
      <div className="flex h-full flex-col bg-white">
        {/* Replace Student Link once student page is ready */}
        {program && (
          <>
            <p className={messageClass}>
              You can add a student to this program from their individual profile. See{" "}
              <u>
                <Link href="/home">all students</Link>
              </u>
            </p>
            <div className={middleDivClass}>
              <div className={outerTableClass}>
                <div className={innerTableClass}>
                  {enrollments && allStudents && (
                    <ProgramProfileTable enrollments={enrollments} allStudents={allStudents} />
                  )}
                </div>
              </div>
            </div>
            <div className={bottomDivClass}></div>
          </>
        )}
      </div>
    </div>
  );
}
