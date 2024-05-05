import { Poppins } from "next/font/google";
//import Image from "next/image";
import React from "react";

import { Program } from "../api/programs";
import ProgramFormButton from "../components/ProgramFormButton";
import { useWindowSize } from "../hooks/useWindowSize";
import { cn } from "../lib/utils";

import { ProgramMap } from "./StudentsTable/types";

const poppins = Poppins({ weight: ["400", "700"], style: "normal", subsets: [] });

export type CardProps = {
  program: Program;
  isAdmin: boolean;
  className?: string;
  setPrograms: React.Dispatch<React.SetStateAction<ProgramMap>>;
};

/*function processDate(startString: Date): string {
  const startDate = new Date(startString);

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  } as const;

  return "Started " + startDate.toLocaleDateString("en-US", options);
}*/

export function ProgramCard({ program, isAdmin, className, setPrograms }: CardProps) {
  const { isTablet } = useWindowSize();

  let outerDivClass = "text-white grow overflow-hidden tracking-wide leading-6";
  let topDivClass = "flex flex-row";
  let botDivClass = "text-black bg-white";
  let typeClass;
  let titleClass;
  let optionsDiv = "grow";
  const optionsClass = "relative float-right hover:cursor-pointer";
  //let dateClass;
  //let numClass;
  //let numTextClass;
  //let iconClass = "relative";

  const programFields: Program = {
    _id: program._id,
    name: program.name,
    abbreviation: program.abbreviation,
    type: program.type,
    daysOfWeek: program.daysOfWeek,
    //startDate: program.startDate,
    //endDate: program.endDate,
    color: program.color,
    //renewalDate: program.renewalDate,
    hourlyPay: program.hourlyPay,
    sessions: program.sessions,
    //students: program.students,
  };

  if (isTablet) {
    outerDivClass += " rounded-lg h-36";
    topDivClass += " h-20";
    botDivClass += " h-16";
    typeClass = cn("uppercase relative text-[10px] top-2 left-3", poppins.className);
    titleClass = cn("capitalize relative text-sm top-2 left-3 font-bold", poppins.className);
    optionsDiv += " pr-[8px] pt-[12px]";
    //dateClass = cn("relative text-[10px] top-2 left-3", poppins.className);
    //numClass = "h-5 gap-x-1.5 flex flex-row relative top-2 left-3";
    //numTextClass = cn("text-[10px]", poppins.className);
    //iconClass = "h-2 w-3 mt-[7px]";
  } else {
    outerDivClass += " rounded-2xl h-68";
    topDivClass += " h-36";
    botDivClass += " h-32";
    typeClass = cn("uppercase relative text-sm top-5 left-7", poppins.className);
    titleClass = cn("capitalize relative text-3xl top-8 left-7 font-bold", poppins.className);
    optionsDiv += " pr-[16px] pt-[24px]";
    //dateClass = cn("relative text-base top-5 left-7", poppins.className);
    //numClass = "h-8 gap-x-1.5 flex flex-row relative top-14 left-7";
    //numTextClass = cn("text-base", poppins.className);
    //iconClass = "h-3 w-[18px] mt-[5px]";
  }

  if (className) {
    outerDivClass = cn(outerDivClass, className);
  }

  return (
    <div className={outerDivClass}>
      <div className={topDivClass} style={{ backgroundColor: program.color }}>
        <div>
          <p className={typeClass}>{program.type} Program</p>
          <p className={titleClass}>{program.name}</p>
        </div>
        {isAdmin && (
          <div className={optionsDiv}>
            <div className={optionsClass}>
              <ProgramFormButton type="edit" data={programFields} setPrograms={setPrograms} />
            </div>
          </div>
        )}
      </div>
      <div className={botDivClass}>
        {/*<p className={dateClass}>{processDate(program.startDate)}</p>}
        <div className={numClass}>
          <Image
            alt="students"
            src="/programs/Students.png"
            height={12}
            width={18}
            className={iconClass}
          />
          {program.students.length === 0 && <p className={numTextClass}>No Students</p>}
          {program.students.length === 1 && <p className={numTextClass}>1 Student</p>}
          {program.students.length > 1 && (
            <p className={numTextClass}>{program.students.length} Students</p>
          )}
        </div>*/}
      </div>
    </div>
  );
}
