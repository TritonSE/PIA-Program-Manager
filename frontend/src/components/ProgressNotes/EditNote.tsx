import { useRef } from "react";

import Back from "../../../public/icons/back.svg";
import Delete from "../../../public/icons/delete.svg";
import Edit from "../../../public/icons/edit.svg";
import { Button } from "../Button";

import { ViewMode } from "./NotePreview";
import { ProgressNote } from "./types";

import { createProgressNote } from "@/api/progressNotes";
import { StudentWithNotes } from "@/pages/notes";

type EditNoteProps = {
  selectedStudent: StudentWithNotes;
  selectedNote: ProgressNote;
  firebaseToken: string;
  handleBackButton: () => void;
  noteMode: ViewMode;
};

function EditNote({
  selectedStudent,
  selectedNote,
  firebaseToken,
  handleBackButton,
  noteMode,
}: EditNoteProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const noteContent = inputRef.current?.value ?? "";
    if (noteContent === "") {
      return;
    }

    createProgressNote(selectedStudent._id, new Date(), noteContent, firebaseToken).then(
      (result) => {
        if (result.success) {
          console.log("Created progress note", result.data);
        } else {
          console.error(result.error);
        }
      },
      (error) => {
        console.error(error);
      },
    );
  };
  return (
    <article className="flex h-full flex-col px-6 py-7">
      <div className="flex justify-between pb-5">
        <button onClick={handleBackButton}>
          <Back />
        </button>
        <div className="flex">
          <Edit />
          <Delete />
        </div>
      </div>
      <h2 className="text-2xl font-bold">
        Notes for {`${selectedStudent.student.firstName} ${selectedStudent.student.lastName}`}
      </h2>
      <p>Mode: {noteMode}</p>
      <form onSubmit={handleSubmit} className="flex h-full flex-col gap-5">
        <textarea ref={inputRef} className="h-full w-full" defaultValue={selectedNote.content} />
        {noteMode !== "view" && (
          <div className="ml-auto flex gap-5">
            <Button label="Cancel" kind="secondary" type="button" />
            <Button label="Save" />
          </div>
        )}
      </form>
    </article>
  );
}
export default EditNote;
