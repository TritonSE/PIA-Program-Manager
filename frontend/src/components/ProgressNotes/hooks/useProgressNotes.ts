import { useContext, useEffect, useState } from "react";

import { ProgressNote } from "../types";

import { getAllProgressNotes } from "@/api/progressNotes";
import { getAllStudents } from "@/api/students";
import { UserContext } from "@/contexts/user";
import { useWindowSize } from "@/hooks/useWindowSize";
import { HandleNoteUpdate, StudentWithNotes, ViewMode } from "@/pages/notes";

export const useProgressNotes = () => {
  const { firebaseUser } = useContext(UserContext);
  const [firebaseToken, setFirebaseToken] = useState("");

  const [filteredStudents, setFilteredStudents] = useState<StudentWithNotes[]>([]);
  const [allStudents, setAllStudents] = useState<StudentWithNotes[] | undefined>(undefined);

  const [selectedStudent, setSelectedStudent] = useState<StudentWithNotes>({} as StudentWithNotes);
  const [selectedNote, setSelectedNote] = useState<ProgressNote>({} as ProgressNote);
  const [noteMode, setNoteMode] = useState<ViewMode>("list");

  const [allProgressNotes, setAllProgressNotes] = useState<
    Record<string, ProgressNote> | undefined
  >(undefined);

  const [mobileView, setMobileView] = useState<"studentList" | "studentDetails">("studentList");
  const { isMobile } = useWindowSize();

  const fetchProgressNotes = async (token: string) => {
    try {
      const result = await getAllProgressNotes(token);
      if (result.success) {
        const sortedData = result.data.sort(
          (a, b) => new Date(b.dateLastUpdated).getTime() - new Date(a.dateLastUpdated).getTime(),
        );
        const progressNotes = sortedData.reduce<Record<string, ProgressNote>>((obj, note) => {
          obj[note._id] = note;
          return obj;
        }, {});
        setAllProgressNotes(progressNotes);
        return progressNotes; // Return the progress notes
      } else {
        console.log(result.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStudentData = async (progressNotes: Record<string, ProgressNote>) => {
    try {
      const result = await getAllStudents();
      if (result.success) {
        const studentDataWithNotes: StudentWithNotes[] = result.data.map((student) => ({
          ...student,
          progressNotes: student.progressNotes
            ? student.progressNotes
                .map((noteId) => progressNotes[noteId])
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
        setFilteredStudents(studentDataWithNotes);
        if (result.data.length < 0) {
          throw new Error("No students found");
        }
      } else {
        console.log(result.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch Progress Notes and Students
  useEffect(() => {
    if (firebaseUser) {
      firebaseUser
        ?.getIdToken()
        .then(async (token) => {
          setFirebaseToken(token);

          const progressNotes = await fetchProgressNotes(token);
          if (progressNotes) {
            await fetchStudentData(progressNotes);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [firebaseUser]);

  // Students Notes Hook

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

  const handleMobileBack = () => {
    setMobileView("studentList");
  };

  const handleFilterQuery = (query: string) => {
    if (allStudents === undefined) return;
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

  const handleSelectProgram = (programId: string) => {
    if (allStudents === undefined) return;
    setFilteredStudents(
      allStudents.filter((student) => {
        return (
          student.enrollments.filter((studentProgram) => {
            if (programId === "") return true;
            return studentProgram.programId === programId && studentProgram.status === "Joined";
          }).length > 0
        );
      }),
    );
  };

  const handlers = {
    handleSelectStudent,
    handleNoteUpdate,
    handleFinishDelete,
    handleMobileBack,
    handleFilterQuery,
    handleSelectProgram,
  };

  return {
    firebaseUser,
    filteredStudents,
    selectedStudent,
    setFilteredStudents,
    allStudents,
    selectedNote,
    setSelectedNote,
    mobileView,
    noteMode,
    setNoteMode,
    handlers,
    firebaseToken,
    allProgressNotes,
  };
};
