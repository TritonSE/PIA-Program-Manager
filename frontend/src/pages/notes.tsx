import { useContext } from "react";

import { Student } from "@/api/students";
import LoadingSpinner from "@/components/LoadingSpinner";
import NotePreview from "@/components/ProgressNotes/NotePreview";
import NotesSelectionList from "@/components/ProgressNotes/NotesSelectionList";
import { useProgressNotes } from "@/components/ProgressNotes/hooks/useProgressNotes";
import { useStudentNotes } from "@/components/ProgressNotes/hooks/useStudentNotes";
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
  const { isMobile } = useWindowSize();

  // Manages fetching and state of progress notes
  const { firebaseToken, allProgressNotes, setAllProgressNotes } = useProgressNotes(firebaseUser);

  // Manages state of student selection and note interactions
  const {
    filteredStudents,
    setFilteredStudents,
    allStudents,
    selectedStudent,
    mobileView,
    noteMode,
    setNoteMode,
    selectedNote,
    setSelectedNote,
    handlers,
  } = useStudentNotes(allProgressNotes, setAllProgressNotes);

  const {
    handleSelectStudent,
    handlePopulatingStudents,
    handleFilterQuery,
    handleNoteUpdate,
    handleMobileBack,
    handleFinishDelete,
  } = handlers;

  return (
    <section className="flex h-full flex-col text-[12px] sm:text-sm">
      <h1 className={"mb-5 font-[alternate-gothic] text-2xl lg:text-4xl "}>Progress Notes</h1>
      {!firebaseUser || allProgressNotes === undefined ? (
        <LoadingSpinner />
      ) : (
        <div className="flex h-full gap-5 overflow-hidden">
          {/* Show both components on Desktop */}
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
                handlers={{ handleFilterQuery, handleNoteUpdate, handleFinishDelete }}
                noteProps={{ noteMode, setNoteMode, selectedNote, setSelectedNote }}
              />
            </>
          ) : (
            <>
              {/* Show only one component at a time on Mobile */}
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
                  handlers={{
                    handleFilterQuery,
                    handleNoteUpdate,
                    handleMobileBack,
                    handleFinishDelete,
                  }}
                  noteProps={{ noteMode, setNoteMode, selectedNote, setSelectedNote }}
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
