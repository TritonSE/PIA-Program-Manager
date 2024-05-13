import { Student } from "@/api/students";
import LoadingSpinner from "@/components/LoadingSpinner";
import NotePreview from "@/components/ProgressNotes/NotePreview";
import NotesFilter from "@/components/ProgressNotes/NotesFilter";
import NotesSelectionList from "@/components/ProgressNotes/NotesSelectionList";
import { useProgressNotes } from "@/components/ProgressNotes/hooks/useProgressNotes";
import { ProgressNote } from "@/components/ProgressNotes/types";
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
  const { isMobile } = useWindowSize();

  const {
    firebaseUser,
    filteredStudents,
    selectedStudent,
    allStudents,
    selectedNote,
    setSelectedNote,
    mobileView,
    noteMode,
    setNoteMode,
    handlers,
    firebaseToken,
    allProgressNotes,
  } = useProgressNotes();

  const {
    handleSelectStudent,
    handleFilterQuery,
    handleNoteUpdate,
    handleMobileBack,
    handleFinishDelete,
    handleSelectProgram,
  } = handlers;

  return (
    <section className="flex h-full flex-col text-[12px] sm:text-sm">
      <h1 className={"mb-5 font-[alternate-gothic] text-2xl lg:text-4xl "}>Progress Notes</h1>
      <NotesFilter
        handleFilterQuery={handleFilterQuery}
        handleSelectProgram={handleSelectProgram}
        mobileView={mobileView}
      />
      {!firebaseUser || allProgressNotes === undefined || allStudents === undefined ? (
        <LoadingSpinner />
      ) : (
        <div className="flex h-full gap-5 overflow-hidden">
          {/* Show both components on Desktop */}
          {!isMobile ? (
            <>
              <NotesSelectionList
                handlers={{ handleSelectStudent }}
                studentProps={{
                  selectedStudent,
                  allStudents,
                  filteredStudents,
                }}
              />
              <NotePreview
                allProgressNotes={allProgressNotes}
                selectedStudent={selectedStudent}
                firebaseToken={firebaseToken}
                handlers={{ handleNoteUpdate, handleFinishDelete }}
                noteProps={{ noteMode, setNoteMode, selectedNote, setSelectedNote }}
              />
            </>
          ) : (
            <>
              {/* Show only one component at a time on Mobile */}
              {mobileView === "studentList" ? (
                <NotesSelectionList
                  handlers={{ handleSelectStudent }}
                  studentProps={{
                    selectedStudent,
                    allStudents,
                    filteredStudents,
                  }}
                />
              ) : (
                <NotePreview
                  allProgressNotes={allProgressNotes}
                  selectedStudent={selectedStudent}
                  firebaseToken={firebaseToken}
                  handlers={{
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
