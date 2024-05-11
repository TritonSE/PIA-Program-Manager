import { useContext, useEffect, useState } from "react";

import { getAllProgressNotes } from "@/api/progressNotes";
import { Student } from "@/api/students";
import LoadingSpinner from "@/components/LoadingSpinner";
import NotePreview from "@/components/ProgressNotes/NotePreview";
import NotesSelectionList from "@/components/ProgressNotes/NotesSelectionList";
import { ProgressNote } from "@/components/ProgressNotes/types";
import { UserContext } from "@/contexts/user";
import { useRedirectToLoginIfNotSignedIn } from "@/hooks/redirect";
import { useWindowSize } from "@/hooks/useWindowSize";

export type StudentWithNotes = Omit<Student, "progressNotes"> & {
  progressNotes: ProgressNote[];
};

export type HandleNoteUpdate = {
  action: "edit" | "delete" | "add";
  noteData: ProgressNote;
};

export type ViewMode = "list" | "view" | "edit" | "add";

function Notes() {
  useRedirectToLoginIfNotSignedIn();
  const { firebaseUser } = useContext(UserContext);

  const [firebaseToken, setFirebaseToken] = useState<string>("");
  const [filteredStudents, setFilteredStudents] = useState<StudentWithNotes[]>([]);
  const [allStudents, setAllStudents] = useState<StudentWithNotes[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithNotes>({} as StudentWithNotes);
  const [selectedNote, setSelectedNote] = useState<ProgressNote>({} as ProgressNote);
  const [mobileView, setMobileView] = useState<"studentList" | "studentDetails">("studentList");
  const { isMobile } = useWindowSize();

  // Used for undoing note deletion
  const [deletedNote, setDeletedNote] = useState<ProgressNote | undefined>(undefined);
  // List mode shows all notes for the selected student
  // View, edit, add modes show a single note
  const [noteMode, setNoteMode] = useState<ViewMode>("list");
  const [allProgressNotes, setAllProgressNotes] = useState<
    Record<string, ProgressNote> | undefined
  >(undefined);

  useEffect(() => {
    if (firebaseUser) {
      firebaseUser
        ?.getIdToken()
        .then((token) => {
          setFirebaseToken(token);
          getAllProgressNotes(token).then(
            (result) => {
              if (result.success) {
                const sortedData = result.data.sort(
                  (a, b) =>
                    new Date(b.dateLastUpdated).getTime() - new Date(a.dateLastUpdated).getTime(),
                );
                const progressNotes = sortedData.reduce<Record<string, ProgressNote>>(
                  (obj, note) => {
                    obj[note._id] = note;
                    return obj;
                  },
                  {},
                );
                setAllProgressNotes(progressNotes);
              }
            },
            (error) => {
              console.log(error);
            },
          );
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [firebaseUser]);

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

  return (
    <section className="flex h-full flex-col text-sm ">
      <h1 className={"mb-5 font-[alternate-gothic] text-4xl"}>Progress Notes</h1>
      {!firebaseUser || allProgressNotes === undefined ? (
        <LoadingSpinner />
      ) : (
        <div className="flex h-full gap-5 overflow-hidden">
          {!isMobile ? (
            <>
              <NotesSelectionList
                allProgressNotes={allProgressNotes}
                studentHandlers={{ handleSelectStudent, handlePopulatingStudents }}
                studentProps={{
                  selectedStudent,
                  allStudents,
                  filteredStudents,
                  setFilteredStudents,
                }}
              />
              <NotePreview
                allProgressNotes={allProgressNotes}
                selectedStudent={selectedStudent}
                firebaseToken={firebaseToken}
                handlers={{ handleFilterQuery, handleNoteUpdate }}
                noteProps={{ noteMode, setNoteMode, selectedNote, setSelectedNote }}
                deleteProps={{ deletedNote, setDeletedNote, handleFinishDelete }}
              />
            </>
          ) : (
            <>
              {mobileView === "studentList" ? (
                <NotesSelectionList
                  allProgressNotes={allProgressNotes}
                  studentHandlers={{ handleSelectStudent, handlePopulatingStudents }}
                  studentProps={{
                    selectedStudent,
                    allStudents,
                    filteredStudents,
                    setFilteredStudents,
                  }}
                />
              ) : (
                <NotePreview
                  allProgressNotes={allProgressNotes}
                  selectedStudent={selectedStudent}
                  firebaseToken={firebaseToken}
                  handlers={{ handleFilterQuery, handleNoteUpdate, handleMobileBack }}
                  noteProps={{ noteMode, setNoteMode, selectedNote, setSelectedNote }}
                  deleteProps={{ deletedNote, setDeletedNote, handleFinishDelete }}
                  isMobile={isMobile}
                />
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}
export default Notes;
