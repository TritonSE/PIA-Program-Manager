import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { ProgramMap } from "../StudentsTable/types";

import { ProgressNote } from "./types";

import { Program, getAllPrograms } from "@/api/programs";
import { getAllStudents } from "@/api/students";
import { StudentWithNotes } from "@/pages/notes";

type NotesSelectionListProps = {
  studentProps: {
    allStudents: StudentWithNotes[];
    setAllStudents: Dispatch<SetStateAction<StudentWithNotes[]>>;
  };
  selectedStudent: StudentWithNotes;
  setSelectedStudent: Dispatch<SetStateAction<StudentWithNotes>>;
  allProgressNotes: Record<string, ProgressNote> | undefined;
  handleSelectStudent: (student: StudentWithNotes) => void;
};

export const dateOptions = {
  year: "2-digit",
  month: "numeric",
  day: "numeric",
} as const;

function NotesSelectionList({
  studentProps,
  selectedStudent,
  setSelectedStudent,
  allProgressNotes,
  handleSelectStudent,
}: NotesSelectionListProps) {
  const { allStudents, setAllStudents } = studentProps;
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
              ? student.progressNotes
                  .map((noteId) => allProgressNotes[noteId])
                  .sort(
                    (a, b) =>
                      new Date(b.dateLastUpdated).getTime() - new Date(a.dateLastUpdated).getTime(),
                  )
              : [],
          }));
          studentDataWithNotes.sort((a, b) => {
            const aName = `${a.student.firstName} ${a.student.lastName}`;
            const bName = `${b.student.firstName} ${b.student.lastName}`;
            return aName.localeCompare(bName);
          });

          setSelectedStudent(studentDataWithNotes[0]);
          setAllStudents(studentDataWithNotes);
          setIsLoading(false);
          if (result.data.length < 0) {
            throw new Error("No students found");
          }
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
      <ul className="shadow-[0_8px_24px_0px_rgba(24, 139, 138, 0.08)] scrollbar w-full overflow-auto sm:w-2/5">
        {allStudents.map((studentData) => {
          let latestNote = { note: "No notes available", date: "" };
          if (studentData.progressNotes.length !== 0) {
            const noteData = studentData.progressNotes[0];
            latestNote = {
              note: noteData.content,
              date: new Date(noteData.dateLastUpdated).toLocaleDateString("en-US", dateOptions),
            };
          }
          return (
            <li
              onClick={() => {
                handleSelectStudent(studentData);
              }}
              key={studentData._id}
              aria-current={selectedStudent._id === studentData._id ? "true" : "false"}
              className="
              relative bg-white
              transition-colors before:absolute 
              before:bottom-0 before:h-[1px]
              before:w-full before:bg-[#B4B4B4]
              before:content-['']
              first:rounded-tl-md
              first:rounded-tr-md last:rounded-bl-md last:rounded-br-md last:before:hidden 
              hover:bg-pia_primary_light_green_hover aria-current:bg-pia_primary_light_green_hover aria-current:after:absolute
              aria-current:after:bottom-0 aria-current:after:left-0 aria-current:after:h-full aria-current:after:w-[5px] aria-current:after:bg-pia_dark_green aria-current:after:content-[''] aria-current:first:after:rounded-tl-md aria-current:last:after:rounded-bl-md"
            >
              <button
                className={`
                  w-full px-[20px] py-[18px] transition-colors `}
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
