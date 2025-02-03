import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useState } from "react";

import Back from "../../../public/icons/back.svg";
import SaveCancelButtons from "../Modals/SaveCancelButtons";

import { CalendarResponse, editCalendar, getCalendar } from "@/api/calendar";
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
  const router = useRouter();

  const [currStudent, setStudent] = useState<Student>();
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [calendar, setCalendar] = useState<CalendarResponse>();
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseToken, setFirebaseToken] = useState("");
  const [success, setSuccess] = useState(false);

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
          setFirebaseToken(token);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [firebaseUser]);

  useEffect(() => {
    if (calendar) {
      console.log("Calendar loaded");
    }
  }, [calendar]);

  useEffect(() => {
    if (success) {
      setOpenSaveDialog(true);
    }
  }, [success]);

  const updateCalendar = (newHours: number, session: string) => {
    const currCalendar = calendar?.calendar;
    if (!currCalendar) {
      return;
    }
    setCalendar({
      ...calendar,
      calendar: currCalendar.map((slot) => {
        if (slot.session === session) {
          return { ...slot, hours: newHours };
        }
        return slot;
      }),
    });
  };

  const saveCalendar = () => {
    if (calendar) {
      editCalendar(calendar, firebaseToken).then(
        (res) => {
          if (res.success) {
            console.log("Calendar saved");
            setSuccess(true);
          } else {
            console.log("Calendar not saved");
            console.log(res.error);
            setSuccess(false);
          }
        },
        (error) => {
          console.error(error);
        },
      );
    }
  };

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
              {currStudent?.UCINumber}
            </h1>
          </div>
          <CalendarBody calendar={calendar} updateCalendarFunc={updateCalendar} />
          <div className="ml-auto mt-5 flex gap-5">
            <SaveCancelButtons
              isOpen={openSaveDialog}
              onSaveClick={saveCalendar}
              automaticClose={1500}
              setOpen={setOpenSaveDialog}
              onLeave={async () => {
                await router.push("/calendar");
              }}
            >
              {success && (
                <div className="grid w-[400px] place-items-center gap-5 min-[450px]:px-12 min-[450px]:pb-12 min-[450px]:pt-10">
                  <button
                    className="ml-auto"
                    onClick={() => {
                      setOpenSaveDialog(false);
                    }}
                  >
                    <Image src="/icons/close.svg" alt="close" width={13} height={13} />
                  </button>
                  <Image src="/icons/green_check_mark.svg" alt="checkmark" width={54} height={54} />
                  <h3 className="text-lg font-bold">Calendar has been saved!</h3>
                </div>
              )}
            </SaveCancelButtons>
          </div>
        </main>
      )}
    </div>
  );
}
