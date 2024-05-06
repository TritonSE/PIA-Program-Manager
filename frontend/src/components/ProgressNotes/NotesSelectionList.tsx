import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { ProgramMap } from "../StudentsTable/types";

import { ProgressNote } from "./types";

import { Program, getAllPrograms } from "@/api/programs";
import { getAllStudents } from "@/api/students";
import { StudentWithNotes } from "@/pages/notes";

type NotesSelectionListProps = {
  selectedStudent: StudentWithNotes;
  setSelectedStudent: Dispatch<SetStateAction<StudentWithNotes>>;
  allProgressNotes: Record<string, ProgressNote> | undefined;
};

export const dateOptions = {
  year: "2-digit",
  month: "numeric",
  day: "numeric",
} as const;

function NotesSelectionList({
  selectedStudent,
  setSelectedStudent,
  allProgressNotes,
}: NotesSelectionListProps) {
  const [allStudents, setAllStudents] = useState<StudentWithNotes[]>([]);
  const [allPrograms, setAllPrograms] = useState<ProgramMap>({});
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
    if (!allProgressNotes) return;
    getAllStudents().then(
      (result) => {
        if (result.success) {
          const studentDataWithNotes: StudentWithNotes[] = result.data.map((student) => ({
            ...student,
            progressNotes: student.progressNotes
              ? student.progressNotes.map((noteId) => allProgressNotes[noteId])
              : [],
          }));
          studentDataWithNotes.sort((a, b) => {
            const aName = `${a.student.firstName} ${a.student.lastName}`;
            const bName = `${b.student.firstName} ${b.student.lastName}`;
            return aName.localeCompare(bName);
          });
          setAllStudents(studentDataWithNotes);
          setIsLoading(false);
          if (result.data.length < 0) {
            throw new Error("No students found");
          }
          setSelectedStudent(studentDataWithNotes[0]);
        } else {
          console.log(result.error);
        }
      },
      (error) => {
        console.log(error);
      },
    );
  }, [allProgressNotes]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <ul className="shadow-[0_8px_24px_0px_rgba(24, 139, 138, 0.08)] scrollbar w-full overflow-auto sm:w-2/5">
        {allStudents.map((studentData) => {
          let latestNote = { note: "No notes available", date: "" };
          if (studentData.progressNotes.length !== 0) {
            const noteData = studentData.progressNotes.slice(-1)[0];
            latestNote = {
              note: noteData.content,
              date: new Date(noteData.dateLastUpdated).toLocaleDateString("en-US", dateOptions),
            };
          }
          return (
            <li
              onClick={() => {
                setSelectedStudent(studentData);
              }}
              key={studentData._id}
              aria-current={selectedStudent._id === studentData._id ? "true" : "false"}
              className="overflow-hidden border-b-[1px] border-l-[8px] border-b-[#B4B4B4] border-l-white bg-white  transition-colors first:rounded-tl-md first:rounded-tr-md last:rounded-bl-md last:rounded-br-md last:border-b-0 aria-current:border-l-[8px] aria-current:border-l-pia_dark_green aria-current:bg-[#188B8A14]"
            >
              <button
                className={`
                  w-full px-[20px] py-[10px] transition-colors `}
              >
                <div className="flex justify-between">
                  <h2 className="pb-2 font-bold">{`${studentData.student.firstName} ${studentData.student.lastName}`}</h2>
                  <p>{latestNote.date}</p>
                </div>
                <p className="line-clamp-2 text-ellipsis text-left">{latestNote.note}</p>
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}
export default NotesSelectionList;
