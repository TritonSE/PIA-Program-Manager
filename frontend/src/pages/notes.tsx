import { useContext, useEffect, useState } from "react";

import { getAllProgressNotes } from "@/api/progressNotes";
import { Student } from "@/api/students";
import NotePreview from "@/components/ProgressNotes/NotePreview";
import NotesSelectionList from "@/components/ProgressNotes/NotesSelectionList";
import { ProgressNote } from "@/components/ProgressNotes/types";
import { UserContext } from "@/contexts/user";

export type StudentWithNotes = Omit<Student, "progressNotes"> & {
  progressNotes: ProgressNote[];
};

function Notes() {
  const [firebaseToken, setFirebaseToken] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<StudentWithNotes>({} as StudentWithNotes);
  const [allProgressNotes, setAllProgressNotes] = useState<
    Record<string, ProgressNote> | undefined
  >(undefined);
  const { firebaseUser } = useContext(UserContext);

  useEffect(() => {
    if (firebaseUser) {
      firebaseUser
        ?.getIdToken()
        .then((token) => {
          setFirebaseToken(token);
          getAllProgressNotes(token).then(
            (result) => {
              if (result.success) {
                const progressNotes = result.data.reduce<Record<string, ProgressNote>>(
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

  if (!firebaseUser) return <h1>Loading...</h1>;

  return (
    <main className="flex h-full flex-col">
      <h1 className={"font-[alternate-gothic] text-4xl"}>Progress Notes</h1>
      <div className="flex flex-1 gap-5 overflow-hidden">
        <NotesSelectionList
          selectedStudent={selectedStudent}
          setSelectedStudent={setSelectedStudent}
          allProgressNotes={allProgressNotes}
        />
        <NotePreview
          allProgressNotes={allProgressNotes}
          selectedStudent={selectedStudent}
          firebaseToken={firebaseToken}
        />
      </div>
    </main>
  );
}
export default Notes;
