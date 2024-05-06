import { useState } from "react";

import Download from "../../../public/icons/download.svg";
import EditPencil from "../../../public/icons/edit_pencil.svg";
import Plus from "../../../public/icons/plus.svg";
import { Button } from "../Button";

import EditNote from "./EditNote";
import { dateOptions } from "./NotesSelectionList";
import { ProgressNote } from "./types";

import { StudentWithNotes } from "@/pages/notes";

type NotePreviewProps = {
  selectedStudent: StudentWithNotes;
  firebaseToken: string;
  allProgressNotes: Record<string, ProgressNote> | undefined;
};

export type ViewMode = "list" | "view" | "edit" | "add";

function NotePreview({ selectedStudent, firebaseToken, allProgressNotes }: NotePreviewProps) {
  // List mode shows all notes for the selected student
  // View, edit, add modes show a single note
  const [noteMode, setNoteMode] = useState<ViewMode>("list");
  const [selectedNote, setSelectedNote] = useState<ProgressNote>({} as ProgressNote);

  if (Object.keys(selectedStudent).length === 0) {
    return <p>Loading...</p>;
  }

  const handleSelectNote = (note: ProgressNote) => {
    setSelectedNote(note);
    setNoteMode("view");
  };

  if (!allProgressNotes) return <h1>Loading...</h1>;

  const handleBackButton = () => {
    setNoteMode("list");
    setSelectedNote({} as ProgressNote);
  };

  const handleEditButton = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNoteMode("edit");
  };

  return (
    <section className="shadow-[0_8px_24px_0px_rgba(24, 139, 138, 0.08)] hidden w-full rounded-md bg-white sm:block ">
      {noteMode !== "list" ? (
        <EditNote
          selectedStudent={selectedStudent}
          selectedNote={selectedNote}
          firebaseToken={firebaseToken}
          handleBackButton={handleBackButton}
          noteMode={noteMode}
        />
      ) : (
        <>
          <div className="flex justify-between px-6 pt-7 ">
            <h2 className="text-3xl font-bold">{`${selectedStudent.student.firstName} ${selectedStudent.student.lastName}`}</h2>
            <div className="flex gap-5">
              <Button
                label="Add Notes"
                icon={<Plus />}
                onClick={() => {
                  setNoteMode("add");
                }}
              />
              <Button label="Download" icon={<Download />} />
            </div>
          </div>
          <ul>
            {Object.values(allProgressNotes)
              .filter((note) => note.studentId === selectedStudent._id)
              .map((note) => (
                <li
                  className="hover:bg-[#188B8A14] transition-colors border-b-[1px] border-b-[#B4B4B4] first:rounded-tl-md first:rounded-tr-md last:rounded-bl-md last:rounded-br-md last:border-b-0"
                  key={note._id}
                  onClick={() => {
                    handleSelectNote(note);
                  }}
                >
                  <button className="w-full px-6 py-7 text-left">
                    <div className="flex justify-between pb-2 text-[#929292]">
                      <p>
                        {new Date(note.dateLastUpdated).toLocaleDateString("en-US", dateOptions)}
                        &nbsp;| By {note.lastEditedBy}
                      </p>
                      <EditPencil aria-label="Edit Note" onClick={handleEditButton} />
                    </div>
                    <p>{note.content}</p>
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
