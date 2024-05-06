import { Poppins } from "next/font/google";
import Image from "next/image";
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

function toggleEdit(id: string) {
  const editId = "edit" + id;
  console.log(editId);
  const editButton = document.getElementById(editId);
  if (editButton === null) {
    console.log("error");
    return;
  }

  if (editButton.style.display !== "block") {
    editButton.style.display = "block";
  } else {
    editButton.style.display = "none";
  }

  function temp() {
    if (editButton !== null && editButton.style.display === "block") {
      editButton.style.display = "none";
    }
  }

  document.body.addEventListener("click", temp, true);
}

export function ProgramCard({ program, isAdmin, className, setPrograms }: CardProps) {
  const { isTablet } = useWindowSize();

  const editId = "edit" + program._id;
  const optionsId = "option" + program._id;

  const optionsButton = document.getElementById(optionsId);
  if (optionsButton !== null) {
    optionsButton.onclick = function (event) {
      event.preventDefault();
      toggleEdit(program._id);
    };
  }

  let editClass = "absolute right-2 hidden z-10";
  let outerDivClass = "text-white grow overflow-hidden tracking-wide leading-6";
  let topDivClass = "flex flex-row";
  let botDivClass = "text-black bg-white";
  let typeClass;
  let titleClass;
  let optionsDiv = "grow";
  const optionsClass = "relative float-right hover:cursor-pointer z-10";
  let numClass;
  let numTextClass;
  let iconClass = "relative";

  let optionsHeight = 18;
  let optionsWidth = 16;

  const programFields: Program = {
    _id: program._id,
    name: program.name,
    abbreviation: program.abbreviation,
    type: program.type,
    daysOfWeek: program.daysOfWeek,
    startDate: program.startDate,
    endDate: program.endDate,
    color: program.color,
    renewalDate: program.renewalDate,
    hourly: program.hourly,
    sessions: program.sessions,
    students: program.students,
  };

  if (isTablet) {
    editClass += " top-7 w-12 h-5 text-[10px]";
    outerDivClass += " rounded-lg h-36";
    topDivClass += " h-20";
    botDivClass += " h-16";
    typeClass = cn("uppercase relative text-[10px] top-2 left-3", poppins.className);
    titleClass = cn("capitalize relative text-sm top-2 left-3 font-bold", poppins.className);
    optionsDiv += " pr-[8px] pt-[12px]";
    optionsHeight /= 2;
    optionsWidth /= 2;
    numClass = "h-5 gap-x-1.5 flex flex-row relative top-2 left-3";
    numTextClass = cn("text-[10px]", poppins.className);
    iconClass = "h-2 w-3 mt-[7px]";
  } else {
    editClass += " top-12 w-24 h-8";
    outerDivClass += " rounded-2xl h-68";
    topDivClass += " h-36";
    botDivClass += " h-32";
    typeClass = cn("uppercase relative text-sm top-5 left-7", poppins.className);
    titleClass = cn("capitalize relative text-3xl top-8 left-7 font-bold", poppins.className);
    optionsDiv += " pr-[16px] pt-[24px]";
    numClass = "h-8 gap-x-1.5 flex flex-row relative top-5 left-7";
    numTextClass = cn("text-base", poppins.className);
    iconClass = "h-3 w-[18px] mt-[5px]";
  }

  if (className) {
    outerDivClass = cn(outerDivClass, className);
  }

  let buttonClass = "relative flex h-full w-full flex-row rounded bg-white";
  let iconHeight = 16;
  let iconWidth = 16;
  let imageClass = "absolute";
  let editTextClass = "absolute text-pia_dark_green";

  if (isTablet) {
    iconHeight = 10;
    iconWidth = 10;
    buttonClass += " py-[3px]";
    imageClass += " left-[7px] top-[5px]";
    editTextClass += " right-[7px]";
  } else {
    buttonClass += " py-1";
    imageClass += " left-2.5 top-2";
    editTextClass += " left-0 w-full";
  }

  const editButton: React.JSX.Element = (
    <button className={buttonClass} value="Edit">
      <Image
        className={imageClass}
        id="editIcon"
        alt="edit"
        src="/programs/EditIcon.png"
        height={iconHeight}
        width={iconWidth}
      />
      <p className={editTextClass}>Edit</p>
    </button>
  );

  return (
    <div className="relative z-0">
      <div id={editId} className={editClass}>
        <ProgramFormButton
          type="edit"
          component={editButton}
          data={programFields}
          setPrograms={setPrograms}
        />
      </div>
      <div className={outerDivClass}>
        <div className={topDivClass} style={{ backgroundColor: program.color }}>
          <div>
            <p className={typeClass}>{program.type} Program</p>
            <p className={titleClass}>{program.name}</p>
          </div>
          {isAdmin && (
            <div className={optionsDiv}>
              <Image
                id={optionsId}
                alt="options"
                src="/programs/Options.png"
                height={optionsHeight}
                width={optionsWidth}
                className={optionsClass}
              />
            </div>
          )}
        </div>
        <div className={botDivClass}>
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
          </div>
        </div>
      </div>
    </div>
  );
}
