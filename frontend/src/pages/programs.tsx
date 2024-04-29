import Image from "next/image";
import React, { useContext, useEffect, useMemo, useState } from "react";

import { Program, getAllPrograms } from "../api/programs";
import { ProgramCard } from "../components/ProgramCard";
import ProgramFormButton from "../components/ProgramFormButton";
import { useWindowSize } from "../hooks/useWindowSize";

import { ProgramMap } from "@/components/StudentsTable/types";
import { UserContext } from "@/contexts/user";
import { useRedirectToLoginIfNotSignedIn } from "@/hooks/redirect";

export default function Programs() {
  useRedirectToLoginIfNotSignedIn();

  const { windowSize } = useWindowSize();
  const isMobile = useMemo(() => windowSize.width < 640, [windowSize.width]);
  const isTablet = useMemo(() => windowSize.width < 1024, [windowSize.width]);
  const extraLarge = useMemo(() => windowSize.width >= 2000, [windowSize.width]);

  const [programs, setPrograms] = useState<ProgramMap>({});

  const { isAdmin } = useContext(UserContext);

  useEffect(() => {
    getAllPrograms().then(
      (result) => {
        if (result.success) {
          const programsObject = result.data.reduce(
            (obj, program) => {
              obj[program._id] = program;
              return obj;
            },
            {} as Record<string, Program>,
          );
          setPrograms(programsObject);
        }
      },
      (error) => {
        console.log(error);
      },
    );
  });

  let mainClass = "h-full overflow-y-scroll no-scrollbar flex flex-col";
  let titleClass = "font-[alternate-gothic]";
  let headerClass = "flex flex-row";
  let cardsGridClass = "grid";
  let cardClass = "";

  let emptyClass = "w-fill grow content-center justify-center";
  let emptyHeight;
  let emptyWidth;

  if (isTablet) {
    titleClass += " text-2xl leading-none h-6";
    mainClass += " p-0";
    emptyClass += " pb-24";
    emptyHeight = 46;
    emptyWidth = 86;

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
    emptyClass += " pb-40";
    emptyHeight = 99;
    emptyWidth = 156;

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
        {isAdmin && <ProgramFormButton type="add" setPrograms={setPrograms} />}
        {/* Should be replaced with Add Button when created */}
      </div>
      {Object.keys(programs).length === 0 && (
        <div className={emptyClass}>
          <div className={"flex flex-row justify-center"}>
            <Image
              id="emptyId"
              alt="empty"
              src="/programs/Empty.png"
              height={emptyHeight}
              width={emptyWidth}
            />
          </div>
        </div>
      )}
      {Object.keys(programs).length > 0 && (
        <div className={cardsGridClass}>
          {Object.values(programs).map((program) => (
            <div className={cardClass} key={program._id}>
              <ProgramCard program={program} isAdmin={isAdmin} setPrograms={setPrograms} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
