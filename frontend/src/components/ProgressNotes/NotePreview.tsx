import { useRef } from "react";

import { Button } from "../Button";

import { createProgressNote } from "@/api/progressNotes";

type NotePreviewProps = {
  studentId: string;
  firebaseToken: string;
};

function NotePreview({ studentId, firebaseToken }: NotePreviewProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const noteContent = inputRef.current?.value ?? "";
    if (noteContent === "") {
      return;
    }

    createProgressNote(studentId, new Date(), noteContent, firebaseToken).then(
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

  if (studentId === "") {
    return <p>Loading...</p>;
  }

  return (
    <article>
      <h2>Notes</h2>
      <form onSubmit={handleSubmit}>
        <input ref={inputRef} type="text" />
        <Button label="Cancel" kind="secondary" type="button" />
        <Button label="Save" />
      </form>
    </article>
  );
}
export default NotePreview;
