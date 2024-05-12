import { useEffect, useState } from "react";

import { Program, getAllPrograms } from "@/api/programs";
import { getAllStudents } from "@/api/students";
import { AttendanceCard } from "@/components/AttendanceCard";
import { AttendanceTable } from "@/components/AttendanceTable";
import { ProgramMap, StudentMap } from "@/components/StudentsTable/types";
import { useRedirectTo404IfNotAdmin, useRedirectToLoginIfNotSignedIn } from "@/hooks/redirect";

export default function AttendanceDashboard() {
  useRedirectToLoginIfNotSignedIn();
  useRedirectTo404IfNotAdmin();

  const [allPrograms, setAllPrograms] = useState<ProgramMap>({}); // map from program id to program
  const [allStudents, setAllStudents] = useState<StudentMap>({});
  const [programsLoading, setProgramsLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(true);

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
          console.log(programsObject);
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
        console.log(result);
        if (result.success) {
          // Convert student array to object with keys as ids and values as corresponding student
          const studentsObject = result.data.reduce((obj, student) => {
            obj[student._id] = student;
            return obj;
          }, {} as StudentMap);
          console.log(result.data);

          setAllStudents(studentsObject);
          setStudentsLoading(false);
        } else {
          console.log(result.error);
        }
      },
      (error) => {
        console.log(error);
      },
    );
  }, []);

  if (programsLoading || studentsLoading) return <p>Loading...</p>;
  else {
    return (
      <main>
        <div className="my-[30px] ml-[20px] mr-[80px] space-y-[20px]">
          <div className="font-[alternate-gothic] text-4xl uppercase">Attendance Dashboard</div>
          <div className="font-[Poppins] text-[16px]">
            Review information of new account creations below to approve or deny them.{" "}
          </div>
          <AttendanceCard programName="Program A" programType="Varying" studentName="Bob Smith" />
          <AttendanceTable
            program={allPrograms["66139c986f3731fef83bdb04"]}
            students={allStudents}
            date={allPrograms["66139c986f3731fef83bdb04"].startDate}
          />
        </div>
      </main>
    );
  }
}
