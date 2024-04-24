import { useContext, useEffect, useState } from "react";

import NotePreview from "@/components/ProgressNotes/NotePreview";
import NotesSelectionList from "@/components/ProgressNotes/NotesSelectionList";
import { UserContext } from "@/contexts/user";

function Notes() {
  const [firebaseToken, setFirebaseToken] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const { firebaseUser } = useContext(UserContext);

  useEffect(() => {
    if (firebaseUser) {
      firebaseUser
        ?.getIdToken()
        .then((token) => {
          setFirebaseToken(token);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [firebaseUser]);

  if (!firebaseUser) return <h1>Loading...</h1>;

  return (
    <main>
      <h1 className={"font-[alternate-gothic] text-4xl"}>Progress Notes</h1>
      <div className="flex gap-5">
        <NotesSelectionList
          selectedStudent={selectedStudent}
          setSelectedStudent={setSelectedStudent}
        />
        <NotePreview studentId={selectedStudent} firebaseToken={firebaseToken} />
      </div>
    </main>
  );
}
export default Notes;
