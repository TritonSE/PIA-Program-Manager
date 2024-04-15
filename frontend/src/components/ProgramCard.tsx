import { Poppins } from "next/font/google";
import React from "react";

import { Program } from "../api/programs";
import ProgramFormButton from "../components/ProgramFormButton";
import { useWindowSize } from "../hooks/useWindowSize";
import { cn } from "../lib/utils";

import { ProgramData } from "./ProgramForm/types";

const poppins = Poppins({ weight: ["400", "700"], style: "normal", subsets: [] });

export type CardProps = {
  program: Program;
  type: string;
  title: string;
  dates: string;
  color: string;
  className?: string;
};

export function ProgramCard({ program, type, title, dates, color, className }: CardProps) {
  const { isTablet } = useWindowSize();

  let outerDivClass = "text-white grow overflow-hidden tracking-wide leading-6";
  let topDivClass = "flex flex-row";
  console.log(topDivClass);
  let botDivClass = "text-black bg-white";
  let typeClass;
  let titleClass;
  let optionsDiv = "grow";
  const optionsClass = "relative float-right hover:cursor-pointer";
  let dateClass;
  // let numClass;
  // let numTextClass;
  // let iconClass = "relative";

  let tempDate = new Date(program.startDate);
  const startDate =
    ("0" + (tempDate.getMonth() + 1)).slice(-2) +
    "/" +
    ("0" + tempDate.getDate()).slice(-2) +
    "/" +
    tempDate.getFullYear();

  tempDate = new Date(program.endDate);
  const endDate =
    ("0" + (tempDate.getMonth() + 1)).slice(-2) +
    "/" +
    ("0" + tempDate.getDate()).slice(-2) +
    "/" +
    tempDate.getFullYear();

  const programData: ProgramData = {
    name: program.name,
    abbreviation: program.abbreviation,
    type: program.type,
    days: program.daysOfWeek,
    start: startDate,
    end: endDate,
    color: program.color,
    renewal: "",
    hourly: "",
    sessions: [[]],
  };

  if (isTablet) {
    outerDivClass += " rounded-lg h-36";
    topDivClass += " h-20";
    botDivClass += " h-16";
    typeClass = cn("uppercase relative text-[10px] top-2 left-3", poppins.className);
    titleClass = cn("capitalize relative text-sm top-2 left-3 font-bold", poppins.className);
    optionsDiv += " pr-[8px] pt-[12px]";
    dateClass = cn("relative text-[10px] top-2 left-3", poppins.className);
    // numClass = "h-5 gap-x-1.5 flex flex-row relative top-2 left-3";
    // numTextClass = cn("text-[10px]", poppins.className);
    // iconClass = "h-2 w-3 mt-[7px]";
  } else {
    outerDivClass += " rounded-2xl h-68";
    topDivClass += " h-36";
    botDivClass += " h-32";
    typeClass = cn("uppercase relative text-sm top-5 left-7", poppins.className);
    titleClass = cn("capitalize relative text-3xl top-8 left-7 font-bold", poppins.className);
    optionsDiv += " pr-[16px] pt-[24px]";
    dateClass = cn("relative text-base top-5 left-7", poppins.className);
    // numClass = "h-8 gap-x-1.5 flex flex-row relative top-14 left-7";
    // numTextClass = cn("text-base", poppins.className);
    // iconClass = "h-3 w-[18px] mt-[5px]";
  }

  if (className) {
    outerDivClass = cn(outerDivClass, className);
  }

  console.log(topDivClass);

  return (
    <div className={outerDivClass}>
      <div className={topDivClass} style={{ backgroundColor: color }}>
        <div>
          <p className={typeClass}>{type} Program</p>
          <p className={titleClass}>{title}</p>
        </div>
        <div className={optionsDiv}>
          <div className={optionsClass}>
            <ProgramFormButton type="edit" data={programData} />{" "}
          </div>
        </div>
      </div>
      <div className={botDivClass}>
        <p className={dateClass}>{dates}</p>
        {/*
        <div className={numClass}>
          <Image
            alt="students"
            src="/programs/Vector.png"
            height={12}
            width={18}
            className={iconClass}
          />
          <p className={numTextClass}>{numStudents} Students</p>
        </div>
        */}
      </div>
    </div>
  );
}
