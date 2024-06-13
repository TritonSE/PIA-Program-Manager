import { useEffect, useRef, useState } from "react";

import { Program, getAllPrograms } from "@/api/programs";
import { AbsenceSession, Session, getAbsenceSessions, getRecentSessions } from "@/api/sessions";
import { getAllStudents } from "@/api/students";
import { AttendanceCard } from "@/components/AttendanceCard";
import { AttendanceTable } from "@/components/AttendanceTable";
import { ProgramMap, StudentMap } from "@/components/StudentsTable/types";
import { useRedirectTo404IfNotAdmin, useRedirectToLoginIfNotSignedIn } from "@/hooks/redirect";

export type Sessions = [Session];
export type AbsenceSessions = AbsenceSession[];

export default function AttendanceDashboard() {
  useRedirectToLoginIfNotSignedIn();
  useRedirectTo404IfNotAdmin();

  const [allSessions, setAllSessions] = useState<Sessions>(); // map from program id to program
  const [allPrograms, setAllPrograms] = useState<ProgramMap>({}); // map from program id to program
  const [allStudents, setAllStudents] = useState<StudentMap>({});
  const [allAbsenceSessions, setAllAbsenceSessions] = useState<AbsenceSessions>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [programsLoading, setProgramsLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [absencsSessionsLoading, setAbsenceSessionsLoading] = useState(true);

  const [remainingSessions, setRemainingSessions] = useState(0);
  const [remainingAbsenceSessions, setRemainingAbsenceSessions] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessionsLoading || studentsLoading || programsLoading || absencsSessionsLoading) {
      return;
    }

    const handleWheel = (e: WheelEvent) => {
      const element = scrollRef.current;
      if (element && element.scrollWidth > element.clientWidth) {
        e.preventDefault();
        scrollRef.current.scrollLeft += e.deltaY;
      }
    };

    const current = scrollRef.current;
    current?.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      current?.removeEventListener("wheel", handleWheel);
    };
  }, [sessionsLoading || studentsLoading || programsLoading || absencsSessionsLoading]);

  useEffect(() => {
    getRecentSessions().then(
      (result) => {
        if (result.success) {
          console.log(result.data);
          setAllSessions(result.data);
          setRemainingSessions(result.data.length);
          setSessionsLoading(false);
        }
      },
      (error) => {
        console.log(error);
      },
    );
  }, []);

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
          setAllPrograms(programsObject);
          setProgramsLoading(false);
        }
      },
      (error) => {
        console.log(error);
      },
    );
  }, []);

  useEffect(() => {
    getAllStudents().then(
      (result) => {
        // console.log(result);
        if (result.success) {
          // Convert student array to object with keys as ids and values as corresponding student
          const studentsObject = result.data.reduce((obj, student) => {
            obj[student._id] = student;
            return obj;
          }, {} as StudentMap);
          setAllStudents(studentsObject);
          setStudentsLoading(false);
        }
      },
      (error) => {
        console.log(error);
      },
    );
  }, []);

  useEffect(() => {
    getAbsenceSessions().then(
      (result) => {
        if (result.success) {
          console.log(result.data);
          setAllAbsenceSessions(result.data);
          setRemainingAbsenceSessions(result.data.length);
          setAbsenceSessionsLoading(false);
        }
      },
      (error) => {
        console.log(error);
      },
    );
  }, []);

  if (sessionsLoading || studentsLoading || programsLoading || absencsSessionsLoading)
    return <p>Loading...</p>;
  else {
    return (
      <main>
        <div className="my-[30px] ml-[20px] mr-[80px]">
          <div className="font-[alternate-gothic] text-4xl uppercase">Attendance Dashboard</div>
          <div className="mt-[20px] font-[Poppins] text-[16px]">
            Review information of new account creations below to approve or deny them.{" "}
          </div>
          <h1 className="mb-[20px] mt-[20px] font-[Poppins-Bold] text-[16px]">Absences</h1>
          <div
            className="flex overflow-x-hidden overflow-y-hidden hover:overflow-x-auto"
            ref={scrollRef}
          >
            {allAbsenceSessions?.map((absenceSession, i) => {
              const program = allPrograms[absenceSession.programId];
              const student = allStudents[absenceSession.studentId];
              return (
                <AttendanceCard
                  program={program}
                  student={student}
                  key={i}
                  setRemainingSessions={setRemainingAbsenceSessions}
                />
              );
            })}
            {remainingAbsenceSessions === 0 && (
              <div className="border-gray flex h-[326px] w-[240px] items-center justify-center rounded-2xl border bg-white">
                <div className="ml-5">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mb-3"
                  >
                    <path
                      d="M20.4105 1.80828C19.5419 0.0482813 17.0325 0.0482813 16.1656 1.80828L11.7705 10.7095L1.9468 12.1381C0.0039379 12.4205 -0.76994 14.8058 0.634142 16.1756L7.74435 23.1046L6.06598 32.8891C5.73455 34.8238 7.76394 36.2981 9.50108 35.3854L16.9248 31.4817C16.7428 30.6323 16.6514 29.766 16.6521 28.8973V28.8581L8.50679 33.1422L10.1639 23.4769C10.2287 23.0987 10.2006 22.7104 10.082 22.3455C9.96337 21.9806 9.75786 21.65 9.48312 21.3822L2.46271 14.5397L12.1656 13.1291C12.5454 13.074 12.9062 12.9274 13.2168 12.7018C13.5274 12.4763 13.7785 12.1786 13.9484 11.8344L18.288 3.04257L22.626 11.8344C22.9721 12.5332 23.6382 13.0164 24.4088 13.1291L34.1117 14.5397L31.6301 16.9593C32.5212 17.1628 33.3865 17.4662 34.2097 17.8638L35.9403 16.1773C37.3443 14.8075 36.5688 12.4222 34.6276 12.1397L24.8039 10.7111L20.4105 1.80828ZM39.5092 28.8973C39.5092 31.7118 38.3912 34.4111 36.401 36.4012C34.4108 38.3914 31.7115 39.5095 28.897 39.5095C26.0825 39.5095 23.3832 38.3914 21.393 36.4012C19.4028 34.4111 18.2848 31.7118 18.2848 28.8973C18.2848 26.0827 19.4028 23.3835 21.393 21.3933C23.3832 19.4031 26.0825 18.285 28.897 18.285C31.7115 18.285 34.4108 19.4031 36.401 21.3933C38.3912 23.3835 39.5092 26.0827 39.5092 28.8973ZM35.1892 24.2377C35.1134 24.1616 35.0233 24.1013 34.9242 24.0602C34.825 24.019 34.7187 23.9978 34.6113 23.9978C34.5039 23.9978 34.3976 24.019 34.2984 24.0602C34.1992 24.1013 34.1092 24.1616 34.0333 24.2377L26.448 31.8246L23.7607 29.1356C23.6848 29.0597 23.5947 28.9995 23.4955 28.9584C23.3963 28.9174 23.2901 28.8962 23.1827 28.8962C23.0754 28.8962 22.9691 28.9174 22.8699 28.9584C22.7708 28.9995 22.6807 29.0597 22.6048 29.1356C22.5289 29.2115 22.4687 29.3016 22.4276 29.4008C22.3865 29.5 22.3654 29.6062 22.3654 29.7136C22.3654 29.8209 22.3865 29.9272 22.4276 30.0264C22.4687 30.1255 22.5289 30.2156 22.6048 30.2915L25.8701 33.5569C25.9459 33.6329 26.036 33.6932 26.1351 33.7343C26.2343 33.7755 26.3406 33.7967 26.448 33.7967C26.5554 33.7967 26.6617 33.7755 26.7609 33.7343C26.8601 33.6932 26.9501 33.6329 27.026 33.5569L35.1892 25.3936C35.2653 25.3178 35.3256 25.2277 35.3667 25.1285C35.4079 25.0293 35.4291 24.923 35.4291 24.8156C35.4291 24.7083 35.4079 24.6019 35.3667 24.5028C35.3256 24.4036 35.2653 24.3135 35.1892 24.2377Z"
                      fill="#006867"
                    />
                  </svg>
                  Woohoo! There are no absences to be made up at the moment.
                </div>
              </div>
            )}
          </div>

          <h1 className="mt-[20px] font-[Poppins-Bold] text-[16px]">Program Sessions</h1>
          {allSessions?.map((session, i) => {
            return (
              <AttendanceTable
                setRemainingSessions={setRemainingSessions}
                setAllAbsenceSessions={setAllAbsenceSessions}
                setRemainingAbsenceSessions={setRemainingAbsenceSessions}
                program={allPrograms[session.programId]}
                session={session}
                students={allStudents}
                key={i}
              />
            );
          })}
          {remainingSessions === 0 && (
            <div className="border-gray mt-[20px] flex h-[326px] w-[240px] items-center justify-center rounded-2xl border bg-white">
              <div className="ml-5">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mb-3"
                >
                  <path
                    d="M20.4105 1.80828C19.5419 0.0482813 17.0325 0.0482813 16.1656 1.80828L11.7705 10.7095L1.9468 12.1381C0.0039379 12.4205 -0.76994 14.8058 0.634142 16.1756L7.74435 23.1046L6.06598 32.8891C5.73455 34.8238 7.76394 36.2981 9.50108 35.3854L16.9248 31.4817C16.7428 30.6323 16.6514 29.766 16.6521 28.8973V28.8581L8.50679 33.1422L10.1639 23.4769C10.2287 23.0987 10.2006 22.7104 10.082 22.3455C9.96337 21.9806 9.75786 21.65 9.48312 21.3822L2.46271 14.5397L12.1656 13.1291C12.5454 13.074 12.9062 12.9274 13.2168 12.7018C13.5274 12.4763 13.7785 12.1786 13.9484 11.8344L18.288 3.04257L22.626 11.8344C22.9721 12.5332 23.6382 13.0164 24.4088 13.1291L34.1117 14.5397L31.6301 16.9593C32.5212 17.1628 33.3865 17.4662 34.2097 17.8638L35.9403 16.1773C37.3443 14.8075 36.5688 12.4222 34.6276 12.1397L24.8039 10.7111L20.4105 1.80828ZM39.5092 28.8973C39.5092 31.7118 38.3912 34.4111 36.401 36.4012C34.4108 38.3914 31.7115 39.5095 28.897 39.5095C26.0825 39.5095 23.3832 38.3914 21.393 36.4012C19.4028 34.4111 18.2848 31.7118 18.2848 28.8973C18.2848 26.0827 19.4028 23.3835 21.393 21.3933C23.3832 19.4031 26.0825 18.285 28.897 18.285C31.7115 18.285 34.4108 19.4031 36.401 21.3933C38.3912 23.3835 39.5092 26.0827 39.5092 28.8973ZM35.1892 24.2377C35.1134 24.1616 35.0233 24.1013 34.9242 24.0602C34.825 24.019 34.7187 23.9978 34.6113 23.9978C34.5039 23.9978 34.3976 24.019 34.2984 24.0602C34.1992 24.1013 34.1092 24.1616 34.0333 24.2377L26.448 31.8246L23.7607 29.1356C23.6848 29.0597 23.5947 28.9995 23.4955 28.9584C23.3963 28.9174 23.2901 28.8962 23.1827 28.8962C23.0754 28.8962 22.9691 28.9174 22.8699 28.9584C22.7708 28.9995 22.6807 29.0597 22.6048 29.1356C22.5289 29.2115 22.4687 29.3016 22.4276 29.4008C22.3865 29.5 22.3654 29.6062 22.3654 29.7136C22.3654 29.8209 22.3865 29.9272 22.4276 30.0264C22.4687 30.1255 22.5289 30.2156 22.6048 30.2915L25.8701 33.5569C25.9459 33.6329 26.036 33.6932 26.1351 33.7343C26.2343 33.7755 26.3406 33.7967 26.448 33.7967C26.5554 33.7967 26.6617 33.7755 26.7609 33.7343C26.8601 33.6932 26.9501 33.6329 27.026 33.5569L35.1892 25.3936C35.2653 25.3178 35.3256 25.2277 35.3667 25.1285C35.4079 25.0293 35.4291 24.923 35.4291 24.8156C35.4291 24.7083 35.4079 24.6019 35.3667 24.5028C35.3256 24.4036 35.2653 24.3135 35.1892 24.2377Z"
                    fill="#006867"
                  />
                </svg>
                Looks like you&#39;re all up to date! All attendance has been recorded for recent
                program sessions.
              </div>
            </div>
          )}
        </div>
      </main>
    );
  }
}
