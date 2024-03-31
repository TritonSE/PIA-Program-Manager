import React, { useMemo } from "react";

import { ProgramCard } from "../components/ProgramCard";
import { useWindowSize } from "../hooks/useWindowSize";

export default function Programs() {
  const { windowSize, isMobile, isTablet } = useWindowSize();
  const extraLarge = useMemo(() => windowSize.width >= 2000, [windowSize.width]);

  let mainClass = "h-full overflow-y-scroll no-scrollbar";
  let titleClass = "font-[alternate-gothic]";
  let headerClass = "flex flex-row";
  let addTaskClass = "m-0 rounded-3xl bg-pia_dark_green text-white";
  let cardsGridClass = "grid";
  let cardClass = "";

  if (isTablet) {
    titleClass += " text-2xl leading-none h-6";
    mainClass += " p-0";
    addTaskClass += " text-[10px] h-6 px-[10px]";

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
    addTaskClass += " text-base h-12 px-6";
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
        <button type="submit" className={addTaskClass}>
          + Create Program
        </button>
      </div>
      <div className={cardsGridClass}>
        <div className={cardClass}>
          <ProgramCard
            type="Standard"
            title="Intro"
            dates="Jun 12, 2023 - Jun 12, 2024"
            numStudents={1}
            color={1}
          />
        </div>
        <div className={cardClass}>
          <ProgramCard
            type="Standard"
            title="Intro"
            dates="Jun 12, 2023 - Jun 12, 2024"
            numStudents={1}
            color={1}
          />
        </div>
        <div className={cardClass}>
          <ProgramCard
            type="Standard"
            title="Intro"
            dates="Jun 12, 2023 - Jun 12, 2024"
            numStudents={1}
            color={1}
          />
        </div>
        <div className={cardClass}>
          <ProgramCard
            type="Standard"
            title="Intro"
            dates="Jun 12, 2023 - Jun 12, 2024"
            numStudents={1}
            color={1}
          />
        </div>
      </div>
    </main>
  );
}
