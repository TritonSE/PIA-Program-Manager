import { Poppins } from "next/font/google";
import Image from "next/image";
import React from "react";

import { useWindowSize } from "../hooks/useWindowSize";
import { cn } from "../lib/utils";

const poppins = Poppins({ weight: ["400", "700"], style: "normal", subsets: [] });

export type CardProps = {
  type: string;
  title: string;
  dates: string;
  numStudents: number;
  color: number;
  className?: string;
};

export function ProgramCard({ type, title, dates, numStudents, color, className }: CardProps) {
  const { isTablet } = useWindowSize();

  let outerDivClass = "text-white grow overflow-hidden tracking-wide leading-6";
  let topDivClass = "";
  let botDivClass = "text-black bg-white";
  let typeClass;
  let titleClass;
  let dateClass;
  let numClass;
  let numTextClass;
  let iconClass = "relative";

  if (isTablet) {
    outerDivClass += " rounded-lg h-36";
    topDivClass += " h-20";
    botDivClass += " h-16";
    typeClass = cn("uppercase relative text-[10px] top-2 left-3", poppins.className);
    titleClass = cn("capitalize relative text-sm top-2 left-3 font-bold", poppins.className);
    dateClass = cn("relative text-[10px] top-2 left-3", poppins.className);
    numClass = "h-5 gap-x-1.5 flex flex-row relative top-2 left-3";
    numTextClass = cn("text-[10px]", poppins.className);
    iconClass = "h-2 w-3 mt-[7px]";
  } else {
    outerDivClass += " rounded-2xl h-68";
    topDivClass += " h-36";
    botDivClass += " h-32";
    typeClass = cn("uppercase relative text-sm top-5 left-7", poppins.className);
    titleClass = cn("capitalize relative text-3xl top-8 left-7 font-bold", poppins.className);
    dateClass = cn("relative text-base top-5 left-7", poppins.className);
    numClass = "h-8 gap-x-1.5 flex flex-row relative top-14 left-7";
    numTextClass = cn("text-base", poppins.className);
    iconClass = "h-3 w-[18px] mt-[5px]";
  }

  switch (color) {
    case 1:
      topDivClass += " bg-secondary_teal";
      break;
    case 2:
      topDivClass += " bg-secondary_yellow";
      break;
    case 3:
      topDivClass += " bg-secondary_red";
      break;
    case 4:
      topDivClass += " bg-secondary_green";
      break;
    default:
      topDivClass += " bg-secondary_teal";
      break;
  }

  if (className) {
    outerDivClass = cn(outerDivClass, className);
  }

  return (
    <div className={outerDivClass}>
      <div className={topDivClass}>
        <p className={typeClass}>{type} Program</p>
        <p className={titleClass}>{title}</p>
      </div>
      <div className={botDivClass}>
        <p className={dateClass}>{dates}</p>
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
      </div>
    </div>
  );
}
