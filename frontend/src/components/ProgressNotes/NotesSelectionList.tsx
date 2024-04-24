import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { ProgramMap } from "../StudentsTable/types";

import { Program, getAllPrograms } from "@/api/programs";
import { Student, getAllStudents } from "@/api/students";

type NotesSelectionListProps = {
  selectedStudent: string;
  setSelectedStudent: Dispatch<SetStateAction<string>>;
};

function NotesSelectionList({ selectedStudent, setSelectedStudent }: NotesSelectionListProps) {
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [allPrograms, setAllPrograms] = useState<ProgramMap>({}); // map from program id to program
  const [isLoading, setIsLoading] = useState(true);

  console.log({ allPrograms });
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
        if (result.success) {
          const studentData = result.data;
          studentData.sort((a, b) => {
            const aName = `${a.student.firstName} ${a.student.lastName}`;
            const bName = `${b.student.firstName} ${b.student.lastName}`;
            return aName.localeCompare(bName);
          });
          setAllStudents(studentData);
          setIsLoading(false);
          if (result.data.length < 0) {
            throw new Error("No students found");
          }
          setSelectedStudent(result.data[0]._id);
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

  return (
    <>
      <ul className="flex flex-col sm:w-2/5">
        {allStudents.map((studentData) => {
          return (
            <li
              onClick={() => {
                setSelectedStudent(studentData._id);
              }}
              key={studentData._id}
            >
              <button
                className={`${selectedStudent === studentData._id ? "border-l-[8px] border-l-pia_dark_green bg-[#188B8A14]" : "border-l-[8px] border-l-white"}
                 flex w-full justify-between border-b-[1px]  border-b-[#B4B4B4] bg-white px-[20px] py-[10px] transition-colors first:rounded-tl-md first:rounded-tr-md last:rounded-bl-md last:rounded-br-md last:border-b-0`}
              >
                <h2 className="pb-2 text-xl font-bold">{`${studentData.student.firstName} ${studentData.student.lastName}`}</h2>

                <p>{"date"}</p>
              </button>
              {/* <p className=" line-clamp-2 text-ellipsis">{latestNote.note}</p> */}
            </li>
          );
        })}
      </ul>
    </>
  );
}
export default NotesSelectionList;
