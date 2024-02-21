import { useEffect, useState } from "react";

import { Student, getAllStudents } from "../api/students";
import StudentFormButton from "../components/StudentFormButton";

export type StudentMap = Record<string, Student>;

export default function Home() {
  const [allStudents, setAllStudents] = useState<StudentMap>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllStudents().then(
      (result) => {
        if (result.success) {
          // Convert student array to object with keys as ids and values as corresponding student
          const studentsObject = result.data.reduce((obj, student) => {
            obj[student._id] = student;
            return obj;
          }, {} as StudentMap);
          setAllStudents(studentsObject);
          setIsLoading(false);
        } else {
          console.log(result.error);
        }
      },
      (error) => {
        console.log(error);
      },
    );
  }, []);

  if (isLoading) return <p>Loading...</p>;

  if (Object.keys(allStudents).length === 0)
    return <p className="text-red-500">Please add a student first!</p>;

  return (
    <div className="w-1/2 space-y-5">
      <StudentFormButton type="add" setAllStudents={setAllStudents} />
      <div className="flex gap-5">
        <ul className="grid gap-5">
          {Object.values(allStudents).map((student) => (
            <li className="flex items-center justify-between gap-5" key={student._id}>
              <p>{student.student.firstName + " " + student.student.lastName}</p>
              <StudentFormButton type="edit" data={student} setAllStudents={setAllStudents} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
