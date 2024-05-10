import { Dispatch, SetStateAction } from "react";

import EditPencilIcon from "../../../public/icons/edit_pencil.svg";
import PlusIcon from "../../../public/icons/plus.svg";
import { Button } from "../Button";

import DownloadNotesDialog from "./DownloadNotesDialog";
import EditNote from "./EditNote";
import { dateOptions } from "./NotesSelectionList";
import { ProgressNote } from "./types";

import { HandleNoteUpdate, StudentWithNotes, ViewMode } from "@/pages/notes";

type NotePreviewProps = {
  selectedStudent: StudentWithNotes;
  firebaseToken: string;
  allProgressNotes: Record<string, ProgressNote> | undefined;
  handleNoteUpdate: (data: HandleNoteUpdate) => void;
  noteProps: {
    noteMode: ViewMode;
    setNoteMode: Dispatch<SetStateAction<ViewMode>>;
    selectedNote: ProgressNote;
    setSelectedNote: Dispatch<SetStateAction<ProgressNote>>;
  };
  deleteProps: DeleteProps;
};

export type DeleteProps = {
  deletedNote: ProgressNote | undefined;
  setDeletedNote: Dispatch<SetStateAction<ProgressNote | undefined>>;
  handleFinishDelete: () => void;
};

function NotePreview({
  selectedStudent,
  firebaseToken,
  allProgressNotes,
  handleNoteUpdate,
  noteProps,
  deleteProps,
}: NotePreviewProps) {
  const { noteMode, setNoteMode, selectedNote, setSelectedNote } = noteProps;

  const handleSelectNote = (note: ProgressNote) => {
    setSelectedNote(note);
    setNoteMode("view");
  };

  const handleBackButton = () => {
    setNoteMode("list");
    setSelectedNote({} as ProgressNote);
  };

  const handleEditButton = (e: React.MouseEvent, note: ProgressNote) => {
    e.stopPropagation();
    setSelectedNote(note);
    setNoteMode("edit");
  };

  if (Object.keys(selectedStudent).length === 0) {
    return <p>Loading...</p>;
  }

  if (!allProgressNotes) return <h1>Loading...</h1>;

  const studentFullName = `${selectedStudent.student.firstName} ${selectedStudent.student.lastName}`;

  return (
    <section className="shadow-[0_8px_24px_0px_rgba(24, 139, 138, 0.08)] hidden w-full rounded-md bg-white sm:flex sm:flex-col">
      {noteMode !== "list" ? (
        <EditNote
          selectedStudent={selectedStudent}
          selectedNote={selectedNote}
          firebaseToken={firebaseToken}
          handleBackButton={handleBackButton}
          handleEditButton={handleEditButton}
          noteMode={noteMode}
          handleNoteUpdate={handleNoteUpdate}
          deleteProps={deleteProps}
        />
      ) : (
        <>
          <div className="flex justify-between px-8 pb-3 pt-7 ">
            <h2 className="text-3xl font-bold">{studentFullName}</h2>
            <div className="flex gap-5">
              <Button
                label="Add Notes"
                icon={<PlusIcon />}
                onClick={() => {
                  // setSelectedNote({} as ProgressNote);
                  setNoteMode("add");
                }}
              />
              <DownloadNotesDialog
                allProgressNotes={allProgressNotes}
                selectedStudent={selectedStudent}
                studentFullName={studentFullName}
              />
            </div>
          </div>
          <ul className="scrollbar overflow-auto">
            {Object.values(allProgressNotes)
              .filter((note) => note.studentId === selectedStudent._id)
              .sort(
                (a, b) =>
                  new Date(b.dateLastUpdated).getTime() - new Date(a.dateLastUpdated).getTime(),
              )
              .map((note) => (
                <li
                  className="border-b-[1px] border-b-[#B4B4B4] transition-colors first:rounded-tl-md first:rounded-tr-md last:rounded-bl-md last:rounded-br-md last:border-b-0 hover:bg-[#188B8A14]"
                  key={note._id}
                  onClick={() => {
                    handleSelectNote(note);
                  }}
                >
                  <button className="w-full px-8 py-7 text-left">
                    <div className="flex justify-between pb-2 text-[#929292]">
                      <p>
                        {new Date(note.dateLastUpdated).toLocaleDateString("en-US", dateOptions)}
                        &nbsp;| By {note.lastEditedBy}
                      </p>
                      <EditPencilIcon
                        className="transition-colors hover:text-pia_dark_green"
                        aria-label="Edit Note"
                        onClick={(e: React.MouseEvent) => {
                          handleEditButton(e, note);
                        }}
                      />
                    </div>
                    <p className="line-clamp-4 text-ellipsis">{note.content}</p>
                  </button>
                </li>
              ))}
          </ul>
        </>
      )}
    </section>
  );
}
export default NotePreview;
