import { Dispatch, SetStateAction, useEffect } from "react";

import { ProgramFilter } from "../StudentsTable/FilterFns";

import { ProgressNote } from "./types";

import { getAllStudents } from "@/api/students";
import { useWindowSize } from "@/hooks/useWindowSize";
import { StudentWithNotes } from "@/pages/notes";

type NotesSelectionListProps = {
  studentProps: {
    selectedStudent: StudentWithNotes;
    allStudents: StudentWithNotes[];
    filteredStudents: StudentWithNotes[];
    setFilteredStudents: Dispatch<SetStateAction<StudentWithNotes[]>>;
  };
  studentHandlers: {
    handlePopulatingStudents: (students: StudentWithNotes[]) => void;
    handleSelectStudent: (student: StudentWithNotes) => void;
  };
  allProgressNotes: Record<string, ProgressNote> | undefined;
};

export const dateOptions = {
  year: "2-digit",
  month: "numeric",
  day: "numeric",
} as const;

function NotesSelectionList({
  studentProps,
  allProgressNotes,
  studentHandlers,
}: NotesSelectionListProps) {
  const { allStudents, selectedStudent, filteredStudents, setFilteredStudents } = studentProps;
  const { handlePopulatingStudents, handleSelectStudent } = studentHandlers;

  const { isMobile } = useWindowSize();

  //Consider lifting fetching progress notes to parent component for better loading experience
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

          handlePopulatingStudents(studentDataWithNotes);
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

  const handleSelectProgram = (programId: string) => {
    setFilteredStudents(
      allStudents.filter((student) => {
        return (
          student.programs.filter((studentProgram) => {
            if (programId === "") return true;
            return studentProgram.programId === programId && studentProgram.status === "Joined";
          }).length > 0
        );
      }),
    );
  };

  return (
    <div className="flex w-full flex-col gap-5 sm:w-3/5 xl:w-2/5">
      <ProgramFilter setValue={handleSelectProgram} className="w-full bg-white" />
      <ul className="shadow-[0_8px_24px_0px_rgba(24, 139, 138, 0.08)] scrollbar overflow-auto">
        {filteredStudents.map((studentData) => {
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
              aria-current={selectedStudent._id === studentData._id && !isMobile ? "true" : "false"}
              className="
              relative bg-white
              transition-colors 
              before:absolute before:bottom-0 before:h-[1px] before:w-full before:bg-[#B4B4B4] before:content-['']
              first:rounded-tl-md first:rounded-tr-md 
              last:rounded-bl-md last:rounded-br-md last:before:hidden 
              hover:bg-pia_primary_light_green_hover aria-current:bg-pia_primary_light_green_hover aria-current:after:absolute
              aria-current:after:left-0 aria-current:after:h-full aria-current:after:w-[5px] aria-current:after:bg-pia_dark_green aria-current:after:content-[''] aria-current:first:after:rounded-tl-md aria-current:last:after:rounded-bl-md"
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
    </div>
  );
}
export default NotesSelectionList;
