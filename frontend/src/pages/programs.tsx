import Image from "next/image";
import React, { useContext, useMemo, useState } from "react";

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

  //const [programs, setPrograms] = useState<ProgramMap>({});
  const [archiveView, setArchiveView] = useState(false);
  const [sliderOffset, setSliderOffset] = useState(0);

  const {
    allPrograms: programs,
    setAllPrograms: setPrograms,
    isLoading,
  } = useContext(ProgramsContext);

  const { isAdmin } = useContext(UserContext);

  let mainClass = "h-full overflow-y-scroll no-scrollbar flex flex-col";
  let titleClass = "font-[alternate-gothic]";
  let headerClass = "flex flex-row";
  let cardsGridClass = "grid ease-in animate-in fade-in-0";
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

  const selectorWrapper =
    "relative sm:m-5 flex grid h-6 sm:min-h-12 w-full sm:w-[256px] grid-cols-2 divide-x border-none pointer-events-auto";
  const selectorClass = "flex h-full w-full items-center justify-center border-none";
  const radioClass = "peer flex h-full w-full appearance-none cursor-pointer";
  const selectorLabel = "absolute pointer-events-none sm:text-lg text-sm text-pia_dark_green";

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
      <div className={selectorWrapper}>
        <div className={selectorClass}>
          <input
            type="radio"
            className={radioClass}
            name="viewSelector"
            defaultChecked={true}
            onInput={() => {
              setSliderOffset(0);
              setArchiveView(false);
            }}
          />
          <div className={selectorLabel}>Active</div>
        </div>
        <div className={selectorClass}>
          <input
            type="radio"
            className={radioClass}
            name="viewSelector"
            onInput={() => {
              setSliderOffset(128);
              setArchiveView(true);
            }}
          />
          <div className={selectorLabel}>Archived</div>
        </div>
        <div
          className="absolute top-full h-0.5 w-[50%] rounded-lg bg-pia_dark_green sm:h-1"
          style={{
            left: isMobile ? (sliderOffset !== 0 ? "50%" : "") : sliderOffset,
            transition: "0.1s ease-out",
          }}
        ></div>
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
            <div className={cardsGridClass} key={archiveView ? "Archive" : "Active"}>
              {Object.values(programs).map((program) =>
                program.archived === archiveView || program.archived === undefined ? (
                  <div className={cardClass} key={program._id}>
                    <ProgramCard program={program} isAdmin={isAdmin} setPrograms={setPrograms} />
                  </div>
                ) : (
                  <></>
                ),
              )}
            </div>
          )}
        </>
      )}
    </main>
  );
}
