import { Poppins } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

import { Enrollment, Program, getProgramEnrollments } from "../api/programs";
import ProgramFormButton from "../components/ProgramFormButton";
import { ProgramProfile } from "../components/ProgramProfile";
import { UserContext } from "../contexts/user";
import { useWindowSize } from "../hooks/useWindowSize";
import { cn } from "../lib/utils";

import { ProgramMap } from "./StudentsTable/types";

const poppins = Poppins({ weight: ["400", "700"], style: "normal", subsets: [] });

export type CardProps = {
  program: Program;
  isAdmin: boolean;
  className?: string;
  setPrograms: React.Dispatch<React.SetStateAction<ProgramMap>>;
  setAlertState: React.Dispatch<React.SetStateAction<{ open: boolean; message: string }>>;
  archiveView?: boolean;
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

export function ProgramCard({
  program,
  isAdmin,
  className,
  setPrograms,
  setAlertState,
  archiveView = false,
}: CardProps) {
  const { isTablet } = useWindowSize();
  const [firebaseToken, setFirebaseToken] = useState<string>();
  const { firebaseUser } = useContext(UserContext);

  const cardId = "card" + program._id;
  const editId = "edit" + program._id;
  const optionsId = "option" + program._id;

  const router = useRouter();

  const [enrollments, setEnrollments] = useState<[Enrollment]>();

  useEffect(() => {
    if (firebaseUser) {
      firebaseUser
        .getIdToken()
        .then((token) => {
          setFirebaseToken(token);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [firebaseUser]);

  useEffect(() => {
    if (firebaseToken) {
      getProgramEnrollments(program._id, firebaseToken).then(
        (result) => {
          if (result.success) {
            setEnrollments(result.data);
            console.log("enrollments found");
          } else {
            console.log("error finding enrollments");
          }
        },
        (error) => {
          console.log(error);
        },
      );
    }
  }, [firebaseToken]);

  const optionsButton = document.getElementById(optionsId);
  if (optionsButton !== null) {
    optionsButton.onclick = function (event) {
      event.stopPropagation();
      toggleEdit(program._id);
    };
  }

  const cardClass = "relative z-0 cursor-pointer";
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
  const dialogBgClass =
    "fixed left-0 top-0 h-full w-full py-10 px-40 bg-black bg-opacity-50 z-20 hidden";
  const dialogClass = "relative z-20 h-full w-full m-auto overflow-hidden rounded-xl";

  let optionsHeight = 18;
  let optionsWidth = 16;

  const programFields: Program = {
    _id: program._id,
    name: program.name,
    abbreviation: program.abbreviation,
    type: program.type,
    daysOfWeek: program.daysOfWeek,
    //startDate: program.startDate,
    //endDate: program.endDate,
    color: program.color,
    //renewalDate: program.renewalDate,
    hourlyPay: program.hourlyPay,
    sessions: program.sessions,
    //students: program.students,
    archived: program.archived,
    dateUpdated: program.dateUpdated,
  };

  const date = new Date(program.dateUpdated);

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
    iconClass = "h-2 w-3 mt-[7.5px]";
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

  function openDialog() {
    console.log("open");
    if (isTablet) {
      router.push("/program/" + program._id);
    } else {
      const dialogBox = document.getElementById("dialog" + program._id);
      if (dialogBox) {
        dialogBox.style.display = "block";
      }
    }
  }

  function closeDialog() {
    console.log("close");
    const dialogBox = document.getElementById("dialog" + program._id);
    if (dialogBox) {
      dialogBox.style.display = "none";
    }
  }

  function getStudentNum(num: number): string {
    if (num === 1) {
      return "1 student";
    } else {
      return num + " students";
    }
  }

  return (
    <div>
      <div id={cardId} className={cardClass} onClick={openDialog}>
        <div
          id={editId}
          className={editClass}
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <ProgramFormButton
            type="edit"
            component={editButton}
            data={programFields}
            setPrograms={setPrograms}
            setAlertState={setAlertState}
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
              {!archiveView && (
                <Image
                  alt="students"
                  src="/programs/Students.png"
                  height={12}
                  width={18}
                  className={iconClass}
                />
              )}
              {enrollments && (
                <p className={numTextClass}>
                  {archiveView
                    ? "Archived on " +
                      (date.getMonth() + 1) +
                      "/" +
                      date.getDate() +
                      "/" +
                      date.getFullYear()
                    : getStudentNum(enrollments.length)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div id={"dialog" + program._id} className={dialogBgClass} onClick={closeDialog}>
        <div
          className={dialogClass}
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <ProgramProfile id={program._id}></ProgramProfile>
          <button
            id="closeButton"
            className="absolute bottom-[40px] right-[40px] rounded bg-pia_dark_green px-[24px] py-[12px] text-white"
            onClick={closeDialog}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
