import { Dispatch, SetStateAction, useState } from "react";

import { ProgressNote } from "@/components/ProgressNotes/types";
import { useWindowSize } from "@/hooks/useWindowSize";
import { HandleNoteUpdate, StudentWithNotes, ViewMode } from "@/pages/notes";

export const useStudentNotes = (
  allProgressNotes: Record<string, ProgressNote> | undefined,
  setAllProgressNotes: Dispatch<SetStateAction<Record<string, ProgressNote> | undefined>>,
) => {
  const [filteredStudents, setFilteredStudents] = useState<StudentWithNotes[]>([]);
  const [allStudents, setAllStudents] = useState<StudentWithNotes[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithNotes>({} as StudentWithNotes);
  const [selectedNote, setSelectedNote] = useState<ProgressNote>({} as ProgressNote);
  const [mobileView, setMobileView] = useState<"studentList" | "studentDetails">("studentList");
  const { isMobile } = useWindowSize();

  const [noteMode, setNoteMode] = useState<ViewMode>("list");

  const updateStudentProgressNotes = ({ action, noteData }: HandleNoteUpdate) => {
    setFilteredStudents((prevStudents) => {
      const updatedStudents = prevStudents.map((student) => {
        if (student._id === noteData.studentId) {
          let updatedProgressNotes;

          if (action === "delete") {
            updatedProgressNotes = student.progressNotes.filter(
              (prevNote) => prevNote._id !== noteData._id,
            );
          } else if (action === "edit") {
            updatedProgressNotes = student.progressNotes.map((prevNote) =>
              prevNote._id === noteData._id ? noteData : prevNote,
            );
          } else if (action === "add") {
            updatedProgressNotes = [...student.progressNotes, noteData];
            updatedProgressNotes.sort(
              (a, b) =>
                new Date(b.dateLastUpdated).getTime() - new Date(a.dateLastUpdated).getTime(),
            );
          }

          return {
            ...student,
            progressNotes: updatedProgressNotes ?? student.progressNotes,
          };
        }
        return student;
      });

      setAllStudents(updatedStudents);
      return updatedStudents;
    });
  };

  const handleSelectStudent = (studentData: StudentWithNotes) => {
    if (studentData._id !== selectedNote.studentId) {
      if (isMobile) {
        setMobileView("studentDetails");
      }
      setNoteMode("list");
      setSelectedNote({} as ProgressNote);
    }
    setSelectedStudent(studentData);
  };

  const handleNoteUpdate = ({ action, noteData }: HandleNoteUpdate) => {
    updateStudentProgressNotes({ action, noteData });
    if (action === "delete" && allProgressNotes) {
      const updatedNotes = Object.keys(allProgressNotes).reduce<Record<string, ProgressNote>>(
        (newNotes, id) => {
          if (id !== noteData._id) {
            newNotes[id] = allProgressNotes[id];
          }
          return newNotes;
        },
        {},
      );

      setAllProgressNotes(updatedNotes);
    } else if (action === "edit" || action === "add") {
      setAllProgressNotes((prevNotes) => {
        const updatedNotes = { ...prevNotes };
        updatedNotes[noteData._id] = noteData;
        return updatedNotes;
      });
    }
  };

  // Used to update state after note is deleted. This cannot run immediately because the dialog will otherwise close before the user can undo the deletion
  const handleFinishDelete = () => {
    setNoteMode("list");
    setSelectedNote({} as ProgressNote);
  };

  const handlePopulatingStudents = (students: StudentWithNotes[]) => {
    setSelectedStudent(students[0]);
    setAllStudents(students);
    setFilteredStudents(students);
  };

  const handleMobileBack = () => {
    setMobileView("studentList");
  };

  const handleFilterQuery = (query: string) => {
    if (query === "") {
      setFilteredStudents(allStudents);
    } else {
      setFilteredStudents(
        allStudents.filter((student) => {
          return (
            `${student.student.firstName} ${student.student.lastName}`
              .toLowerCase()
              .includes(query.toLowerCase()) ||
            student.progressNotes.some((note) =>
              note.content.toLowerCase().includes(query.toLowerCase()),
            )
          );
        }),
      );
    }
  };

  const handlers = {
    handleSelectStudent,
    handleNoteUpdate,
    handleFinishDelete,
    handlePopulatingStudents,
    handleMobileBack,
    handleFilterQuery,
  };

  return {
    filteredStudents,
    setFilteredStudents,
    allStudents,
    selectedStudent,
    selectedNote,
    setSelectedNote,
    mobileView,
    noteMode,
    setNoteMode,
    handlers,
  };
};
