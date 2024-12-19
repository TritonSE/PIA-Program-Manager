import Link from "next/link";
import { useContext, useEffect, useMemo, useState } from "react";

import Back from "../../../public/icons/back.svg";

import { CalendarResponse, getCalendar } from "@/api/calendar";
import { Student, getStudent } from "@/api/students";
import { CalendarBody } from "@/components/Calendar/CalendarBody";
import LoadingSpinner from "@/components/LoadingSpinner";
import { UserContext } from "@/contexts/user";
import { useRedirectToLoginIfNotSignedIn } from "@/hooks/redirect";
import { useWindowSize } from "@/hooks/useWindowSize";

export type CalendarProps = {
  studentId: string;
  programId: string;
};

export default function Calendar({ studentId, programId }: CalendarProps) {
  useRedirectToLoginIfNotSignedIn();

  const { firebaseUser } = useContext(UserContext);

  const [currStudent, setStudent] = useState<Student>();
  //   const [currProgram, setProgram ] = useState<Program>();
  const [calendar, setCalendar] = useState<CalendarResponse>();
  const [isLoading, setIsLoading] = useState(true);

  const { windowSize } = useWindowSize();
  const isMobile = useMemo(() => windowSize.width < 640, [windowSize.width]);
  const isTablet = useMemo(() => windowSize.width < 1024, [windowSize.width]);
  const extraLarge = useMemo(() => windowSize.width >= 2000, [windowSize.width]);

  useEffect(() => {
    if (firebaseUser) {
      firebaseUser
        ?.getIdToken()
        .then(async (token) => {
          const calendarResponse = await getCalendar(studentId, programId, token);
          if (calendarResponse.success) {
            setCalendar(calendarResponse.data);
          }
          const studentResponse = await getStudent(studentId, token);
          if (studentResponse.success) {
            setStudent(studentResponse.data);
            setIsLoading(false);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [firebaseUser]);

  let mainClass = "h-full overflow-y-scroll no-scrollbar flex flex-col";
  let headerClass = "mb-5 font-[alternate-gothic] text-2xl lg:text-4xl ";
  let titleClass = "font-[alternate-gothic]";
  const backButton = "flex space-x-0 text-lg";

  if (isTablet) {
    titleClass += " text-2xl leading-none h-6";
    mainClass += " p-0";

    if (isMobile) {
      headerClass += " pt-2 pb-3";
    } else {
      headerClass += " p-2 py-4";
    }
  } else {
    headerClass += "pt-10 pb-5";

    if (extraLarge) {
      headerClass += " max-w-[1740px]";
    } else {
      headerClass += " max-w-[1160px]";
    }
  }

  return (
    <div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <main className={mainClass}>
          <div className={headerClass}>
            <div className={backButton}>
              <Link href="/calendar">
                <Back width="50" height="50" />
              </Link>
              {!isTablet && <p>Student List</p>}
            </div>
            <h1 className={titleClass}>
              {currStudent?.student.firstName + " " + currStudent?.student.lastName} - UCI #
              123456789
            </h1>
          </div>
          <CalendarBody calendar={calendar} />
        </main>
      )}
    </div>
  );
}
