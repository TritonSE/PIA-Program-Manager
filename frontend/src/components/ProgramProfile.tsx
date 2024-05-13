import { Poppins } from "next/font/google";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { Program, getProgram } from "../api/programs";
import { useWindowSize } from "../hooks/useWindowSize";
import { cn } from "../lib/utils";

import { ProgramProfileTable } from "./ProgramProfileTable";

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

  useEffect(() => {
    getProgram(id).then(
      (result) => {
        if (result.success) {
          setProgram(result.data);
          console.log(id);
        } else {
          setFillerText("No Program Found");
          console.log(fillerText);
        }
      },
      (error) => {
        console.log(error);
      },
    );
  }, []);

  let headerClass = "bg-pia_primary_light_green  text-secondary_teal";
  let titleClass = "font-bold";
  let detailsClass = "relative flex flex-row flex-wrap font-normal";
  let iconClass = "";
  let iconHeight = 12;
  let iconWidth = 18;
  let messageClass = "relative font-normal text-wrap grow-0";
  const tableDivClass =
    "relative border-red border-2 top-0 grow padding w-auto h-1 px-10 overflow-x-scroll no-scrollbar overflow-y-hidden";

  if (isTablet) {
    headerClass += " h-auto pb-8 text-[18px] leading-[27px]";
    detailsClass += " top-2 text-[12px] leading-[16px] gap-2";
    iconClass += " py-[3px] pl-2";
    iconHeight = 10;
    iconWidth = 16;
    if (isMobile) {
      headerClass += " pt-[36px] px-[16px]";
      messageClass += " top-[24px] px-[24px] text-[12px] leading-[16px]";
    } else {
      headerClass += " pt-6 px-12";
      messageClass += " top-[24px] px-[48px] text-[12px] leading-[16px]";
    }
  } else {
    headerClass += " h-[154px] p-10 text-[28px] leading-[42px]";
    detailsClass += " top-0.5 text-[16px] leading-[24px] gap-x-4";
    iconClass += " p-1.5";
    messageClass +=
      " pt-[32px] pb-[12px] px-[40px] text-[16px] leading-[24px] border-black border-2";
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
                {isTablet && <p>5 placeholder</p>}
                <div className={iconClass}>
                  <Image
                    alt="students"
                    src="/programs/GreenStudents.png"
                    height={iconHeight}
                    width={iconWidth}
                  />
                </div>
                {!isTablet && <p>5 placeholder</p>}
              </div>
              <p> • </p>
              <p>${program.hourly}/hour</p>
            </div>
          </div>
        )}
        {!program && <p>{fillerText}</p>}
      </div>
      <div className="flex h-full flex-col border-2 border-black bg-white">
        {/* Replace Student Link once student page is ready */}
        {program && (
          <>
            <p className={messageClass}>
              You can add a student to this program from their individual profile. See{" "}
              <u>
                <a href="/students">all students</a>
              </u>
            </p>
            <div className={tableDivClass}>
              <ProgramProfileTable id={id} />
            </div>
            <div className="h-[112px]">
              <p>test</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
