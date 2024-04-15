import React, { useEffect, useMemo, useState } from "react";

import { Program, getAllPrograms } from "../api/programs";
import { ProgramCard } from "../components/ProgramCard";
import ProgramFormButton from "../components/ProgramFormButton";
import { useWindowSize } from "../hooks/useWindowSize";

import { useRedirectTo404IfNotAdmin, useRedirectToLoginIfNotSignedIn } from "@/hooks/redirect";

function processDate(startString: Date): string {
  const startDate = new Date(startString);

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  } as const;

  return "Started " + startDate.toLocaleDateString("en-US", options);
}

export default function Programs() {
  useRedirectToLoginIfNotSignedIn();
  useRedirectTo404IfNotAdmin();

  const { windowSize } = useWindowSize();
  const isMobile = useMemo(() => windowSize.width < 640, [windowSize.width]);
  const isTablet = useMemo(() => windowSize.width < 1024, [windowSize.width]);
  const extraLarge = useMemo(() => windowSize.width >= 2000, [windowSize.width]);

  const [programs, setPrograms] = useState<Program[]>([]);

  useEffect(() => {
    getAllPrograms().then(
      (result) => {
        if (result.success) {
          setPrograms(result.data);
        } else {
          alert(result.error);
        }
      },
      (error) => {
        console.log(error);
      },
    );
  }, []);

  let mainClass = "h-full overflow-y-scroll no-scrollbar";
  let titleClass = "font-[alternate-gothic]";
  let headerClass = "flex flex-row";
  let cardsGridClass = "grid";
  let cardClass = "";

  if (isTablet) {
    titleClass += " text-2xl leading-none h-6";
    mainClass += " p-0";

    if (isMobile) {
      headerClass += " pt-2 pb-3";
      cardsGridClass += " grid-cols-1";
      cardClass += " p-0 py-3";
    } else {
      cardsGridClass += " grid-cols-2";
      headerClass += " p-2 py-4";
      cardClass += " p-2";
    }
  } else {
    titleClass += " text-[40px] leading-none h-10";
    headerClass += " p-5 pt-10 pb-5";
    cardClass += " p-5";

    if (extraLarge) {
      cardsGridClass += " grid-cols-3 max-w-[1740px]";
      headerClass += " max-w-[1740px]";
    } else {
      cardsGridClass += " grid-cols-2 max-w-[1160px]";
      headerClass += " max-w-[1160px]";
    }
  }

  return (
    <main className={mainClass}>
      <div className={headerClass}>
        <h1 className={titleClass}>Programs</h1>
        <div className="grow"></div>
        {/* Should be replaced with Add Button when created */}
        <ProgramFormButton type="add" />{" "}
      </div>
      <div className={cardsGridClass}>
        {programs.map((program) => (
          <div className={cardClass} key={program._id}>
            <ProgramCard
              type={program.type}
              title={program.name}
              dates={processDate(program.startDate)}
              color={program.color}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
