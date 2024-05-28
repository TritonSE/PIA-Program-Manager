import Image from "next/image";
import React, { useContext, useMemo } from "react";

import { ProgramCard } from "../components/ProgramCard";
import ProgramFormButton from "../components/ProgramFormButton";
import { useWindowSize } from "../hooks/useWindowSize";

import LoadingSpinner from "@/components/LoadingSpinner";
import { ProgramsContext } from "@/contexts/program";
import { UserContext } from "@/contexts/user";
import { useRedirectToLoginIfNotSignedIn } from "@/hooks/redirect";

export default function Programs() {
  useRedirectToLoginIfNotSignedIn();

  const { windowSize } = useWindowSize();
  const isMobile = useMemo(() => windowSize.width < 640, [windowSize.width]);
  const isTablet = useMemo(() => windowSize.width < 1024, [windowSize.width]);
  const extraLarge = useMemo(() => windowSize.width >= 2000, [windowSize.width]);

  const {
    allPrograms: programs,
    setAllPrograms: setPrograms,
    isLoading,
  } = useContext(ProgramsContext);
  const { isAdmin } = useContext(UserContext);

  let mainClass = "h-full overflow-y-scroll no-scrollbar flex flex-col";
  let headerClass = "flex flex-row";
  let titleClass = "font-[alternate-gothic]";
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
    titleClass += " text-4xl leading-none h-10";
    headerClass += "pt-10 pb-5";
    emptyClass += " pb-40";
    emptyHeight = 99;
    emptyWidth = 156;

    if (extraLarge) {
      cardsGridClass += " grid-cols-3 max-w-[1740px]";
      headerClass += " max-w-[1740px]";
    } else {
      cardsGridClass += " grid-cols-2 max-w-[1160px] gap-10";
      headerClass += " max-w-[1160px]";
    }
  }

  let addButtonClass = "m-0 rounded-3xl bg-pia_dark_green text-white";
  if (isTablet) {
    addButtonClass += " text-[10px] h-6 px-[10px]";
  } else {
    addButtonClass += " text-base h-12 px-6";
  }

  const addButton: React.JSX.Element = (
    <button type="submit" className={addButtonClass}>
      + Create Program
    </button>
  );

  return (
    <main className={mainClass}>
      <div className={headerClass}>
        <h1 className={titleClass}>Programs</h1>
        <div className="grow"></div>
        {isAdmin && (
          <ProgramFormButton type="add" component={addButton} setPrograms={setPrograms} />
        )}
        {/* Should be replaced with Add Button when created */}
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
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
        </>
      )}
    </main>
  );
}
