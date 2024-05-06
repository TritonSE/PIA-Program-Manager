import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import { Program, getProgram } from "../../api/programs";
import { useWindowSize } from "../../hooks/useWindowSize";
import { cn } from "../../lib/utils";

const poppins = Poppins({ weight: ["400", "700"], style: "normal", subsets: [] });

export default function Component() {
  const { windowSize } = useWindowSize();
  const isMobile = useMemo(() => windowSize.width < 640, [windowSize.width]);
  const isTablet = useMemo(() => windowSize.width < 1024, [windowSize.width]);

  const router = useRouter();

  const [program, setProgram] = useState<Program>();

  useEffect(() => {
    const { id } = router.query;
    if (id === undefined) {
      return;
    }
    getProgram(id as string).then(
      (result) => {
        if (result.success) {
          setProgram(result.data);
        }
      },
      (error) => {
        console.log(error);
      },
    );
  });

  let mainClass = "bg-white overflow-hidden";
  let headerClass = "bg-pia_primary_light_green  text-secondary_teal";
  let titleClass = "font-bold";
  let detailsClass = "relative flex flex-row flex-wrap font-normal";
  let iconClass = "";
  let backIconClass = "";
  let iconHeight = 12;
  let iconWidth = 18;
  let messageClass = "relative font-normal text-wrap";

  if (isTablet) {
    mainClass += " fixed top-0 left-0 w-full h-full pt-10";
    headerClass += " h-auto pb-8 text-[18px] leading-[27px]";
    detailsClass += " top-2 text-[12px] leading-[16px] gap-2";
    iconClass += " py-[3px] pl-2";
    backIconClass += " fixed top-12 left-2";
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
    mainClass += " h-full rounded-xl";
    headerClass += " h-[154px] p-10 text-[28px] leading-[42px]";
    detailsClass += " top-0.5 text-[16px] leading-[24px] gap-x-4";
    iconClass += " p-1.5";
    messageClass += " top-[32px] px-[40px] text-[16px] leading-[24px]";
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

  if (typeof program !== "undefined") {
    return (
      <main className={mainClass}>
        {isTablet && (
          <Link href="/programs">
            <Image
              alt="back"
              src="/programs/BackArrow.png"
              height={24}
              width={24}
              className={backIconClass}
            />
          </Link>
        )}
        <div className={headerClass}>
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
        {/* Replace Student Link once student page is ready */}
        <p className={messageClass}>
          You can add a student to this program from their individual profile. See{" "}
          <u>
            <a href="/students">all students</a>
          </u>
        </p>
      </main>
    );
  } else {
    // Replace with Loading Gif once it is created
    return <p>loading</p>;
  }
}
