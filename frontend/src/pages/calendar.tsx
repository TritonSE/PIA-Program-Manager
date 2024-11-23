import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

import Back from "../../public/icons/back.svg";

import { Student, getStudent } from "@/api/students";
import { Calendar } from "@/components/Calendar/Calendar";
import CalendarTable from "@/components/CalendarTable/CalendarTable";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useRedirectToLoginIfNotSignedIn } from "@/hooks/redirect";
import { useWindowSize } from "@/hooks/useWindowSize";

export default function Component() {
  useRedirectToLoginIfNotSignedIn();

  const router = useRouter();
  const { student, program } = router.query;

  const [currStudent, setStudent] = useState<Student>();
  //   const [currProgram, setProgram ] = useState<Program>();
  const [isLoading, setIsLoading] = useState(true);

  const { windowSize } = useWindowSize();
  const isMobile = useMemo(() => windowSize.width < 640, [windowSize.width]);
  const isTablet = useMemo(() => windowSize.width < 1024, [windowSize.width]);
  const extraLarge = useMemo(() => windowSize.width >= 2000, [windowSize.width]);

  if (!student || !program) return <CalendarTable />;

  getStudent(student as string).then(
    (result) => {
      if (result.success) {
        setStudent(result.data);
        setIsLoading(false);
      } else {
        console.log(result.error);
      }
    },
    (error) => {
      console.log(error);
    },
  );

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
          <Calendar />
        </main>
      )}
    </div>
  );
}
