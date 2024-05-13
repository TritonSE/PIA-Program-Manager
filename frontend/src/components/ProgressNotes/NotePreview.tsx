import { Dispatch, SetStateAction, useContext } from "react";

import BackIcon from "../../../public/icons/back.svg";
import EditPencilIcon from "../../../public/icons/edit_pencil.svg";
import MobilePlusIcon from "../../../public/icons/mobile_plus.svg";
import PlusIcon from "../../../public/icons/plus.svg";
import { Button } from "../Button";
import NoStudents from "../NoStudents";

import DownloadNotesDialog from "./DownloadNotesDialog";
import EditNote from "./EditNote";
import { dateOptions } from "./NotesSelectionList";
import { ProgressNote } from "./types";

import { UserContext } from "@/contexts/user";
import { useWindowSize } from "@/hooks/useWindowSize";
import { HandleNoteUpdate, StudentWithNotes, ViewMode } from "@/pages/notes";

type NotePreviewProps = {
  selectedStudent: StudentWithNotes;
  firebaseToken: string;
  allProgressNotes: Record<string, ProgressNote>;
  handlers: {
    handleNoteUpdate: (data: HandleNoteUpdate) => void;
    handleMobileBack?: () => void;
    handleFinishDelete: () => void;
  };
  noteProps: {
    noteMode: ViewMode;
    setNoteMode: Dispatch<SetStateAction<ViewMode>>;
    selectedNote: ProgressNote;
    setSelectedNote: Dispatch<SetStateAction<ProgressNote>>;
  };
  isMobile?: boolean;
};

function NotePreview({
  selectedStudent,
  firebaseToken,
  allProgressNotes,
  handlers,
  noteProps,
}: NotePreviewProps) {
  const { isAdmin } = useContext(UserContext);
  const { noteMode, setNoteMode, selectedNote, setSelectedNote } = noteProps;
  const { windowSize, isMobile } = useWindowSize();
  const { handleNoteUpdate, handleMobileBack, handleFinishDelete } = handlers;
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

  let studentFullName = "";
  if (Object.keys(selectedStudent).length !== 0) {
    studentFullName = `${selectedStudent.student.firstName} ${selectedStudent.student.lastName}`;
  }
  return (
    <div className="flex h-full w-full flex-col">
      <section className="flex h-full flex-col overflow-auto rounded-lg bg-white shadow-[0_8px_24px_0px_rgba(0,0,0,0.08)]">
        {Object.keys(selectedStudent).length === 0 ? (
          <NoStudents />
        ) : (
          <>
            {noteMode !== "list" ? (
              <EditNote
                selectedStudent={selectedStudent}
                selectedNote={selectedNote}
                firebaseToken={firebaseToken}
                handleBackButton={handleBackButton}
                handleEditButton={handleEditButton}
                handleNoteUpdate={handleNoteUpdate}
                handleFinishDelete={handleFinishDelete}
                noteMode={noteMode}
              />
            ) : (
              <>
                {isMobile ? (
                  <button onClick={handleMobileBack} className="px-8 pt-3">
                    <BackIcon />
                  </button>
                ) : null}
                <div className="flex justify-between px-8 pb-3 pt-3 sm:pt-7 ">
                  <h2 className="text-2xl font-bold lg:text-3xl">{studentFullName}</h2>
                  <div className="flex gap-8 lg:gap-5">
                    {windowSize.width < 1200 ? (
                      <button
                        onClick={() => {
                          setNoteMode("add");
                        }}
                      >
                        <MobilePlusIcon className="scale-[1.6]" aria-label="Add Note" />
                      </button>
                    ) : (
                      <Button
                        label="Add Notes"
                        icon={<PlusIcon />}
                        onClick={() => {
                          setNoteMode("add");
                        }}
                      />
                    )}
                    {isAdmin ? (
                      <DownloadNotesDialog
                        allProgressNotes={allProgressNotes}
                        selectedStudent={selectedStudent}
                        studentFullName={studentFullName}
                      />
                    ) : null}
                  </div>
                </div>
                <ul className="scrollbar overflow-auto">
                  {Object.keys(allProgressNotes).length === 0 ? (
                    <p className="px-8 py-7">No notes available</p>
                  ) : (
                    Object.values(allProgressNotes)
                      .filter((note) => note.studentId === selectedStudent._id)
                      .sort(
                        (a, b) =>
                          new Date(b.dateLastUpdated).getTime() -
                          new Date(a.dateLastUpdated).getTime(),
                      )
                      .map((note) => (
                        <li
                          className="border-b-[1px] border-b-[#B4B4B4] transition-colors first:rounded-tl-lg first:rounded-tr-lg last:rounded-bl-lg 
                last:rounded-br-lg last:border-b-0 hover:bg-[#188B8A14] "
                          key={note._id}
                          onClick={() => {
                            handleSelectNote(note);
                          }}
                        >
                          <button className="w-full px-8 py-7 text-left focus-visible:bg-[#188B8A14]">
                            <div className="flex justify-between pb-2 text-[#929292]">
                              <p>
                                {new Date(note.dateLastUpdated).toLocaleDateString(
                                  "en-US",
                                  dateOptions,
                                )}
                                &nbsp;| By {note.lastEditedBy}
                              </p>
                              {isAdmin ? (
                                <button
                                  className=" transition-colors hover:text-pia_dark_green focus-visible:text-pia_dark_green"
                                  aria-label="Edit Note"
                                  onClick={(e: React.MouseEvent) => {
                                    handleEditButton(e, note);
                                  }}
                                >
                                  <EditPencilIcon aria-hidden="true" />
                                </button>
                              ) : null}
                            </div>
                            <p className="line-clamp-4 text-ellipsis">{note.content}</p>
                          </button>
                        </li>
                      ))
                  )}
                </ul>
              </>
            )}
          </>
        )}
      </section>
    </div>
  );
}
export default NotePreview;
