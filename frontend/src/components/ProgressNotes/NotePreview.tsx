import { Dispatch, SetStateAction } from "react";

import BackIcon from "../../../public/icons/back.svg";
import EditPencilIcon from "../../../public/icons/edit_pencil.svg";
import MobilePlusIcon from "../../../public/icons/mobile_plus.svg";
import PlusIcon from "../../../public/icons/plus.svg";
import SearchIcon from "../../../public/icons/search.svg";
import { Button } from "../Button";
import DebouncedInput from "../DebouncedInput";

import DownloadNotesDialog from "./DownloadNotesDialog";
import EditNote from "./EditNote";
import { dateOptions } from "./NotesSelectionList";
import { ProgressNote } from "./types";

import { useWindowSize } from "@/hooks/useWindowSize";
import { HandleNoteUpdate, StudentWithNotes, ViewMode } from "@/pages/notes";

type NotePreviewProps = {
  selectedStudent: StudentWithNotes;
  firebaseToken: string;
  allProgressNotes: Record<string, ProgressNote>;
  handlers: {
    handleFilterQuery: (query: string) => void;
    handleNoteUpdate: (data: HandleNoteUpdate) => void;
    handleMobileBack?: () => void;
  };
  noteProps: {
    noteMode: ViewMode;
    setNoteMode: Dispatch<SetStateAction<ViewMode>>;
    selectedNote: ProgressNote;
    setSelectedNote: Dispatch<SetStateAction<ProgressNote>>;
  };
  deleteProps: DeleteProps;
  isMobile?: boolean;
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
  handlers,
  noteProps,
  deleteProps,
}: NotePreviewProps) {
  const { noteMode, setNoteMode, selectedNote, setSelectedNote } = noteProps;
  const { windowSize, isMobile } = useWindowSize();
  const { handleNoteUpdate, handleFilterQuery, handleMobileBack } = handlers;
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

  const studentFullName = `${selectedStudent.student.firstName} ${selectedStudent.student.lastName}`;
  return (
    <div className="flex h-full w-full flex-col">
      <DebouncedInput
        icon={<SearchIcon />}
        iconClassName="scale-90"
        initialValue=""
        onChange={(val) => {
          handleFilterQuery(val);
        }}
        className="mb-5 flex-grow-0 bg-white xl:w-1/2"
        placeholder="Search Students or Notes"
      />
      <section className="shadow-[0_8px_24px_0px_rgba(24, 139,  138, 0.08)] flex h-full flex-col overflow-auto rounded-md bg-white">
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
                    className="border-b-[1px] border-b-[#B4B4B4] transition-colors first:rounded-tl-md first:rounded-tr-md last:rounded-bl-md 
                  last:rounded-br-md last:border-b-0 hover:bg-[#188B8A14] "
                    key={note._id}
                    onClick={() => {
                      handleSelectNote(note);
                    }}
                  >
                    <button className="w-full px-8 py-7 text-left focus-visible:bg-[#188B8A14]">
                      <div className="flex justify-between pb-2 text-[#929292]">
                        <p>
                          {new Date(note.dateLastUpdated).toLocaleDateString("en-US", dateOptions)}
                          &nbsp;| By {note.lastEditedBy}
                        </p>
                        <button
                          className=" transition-colors hover:text-pia_dark_green focus-visible:text-pia_dark_green"
                          aria-label="Edit Note"
                          onClick={(e: React.MouseEvent) => {
                            handleEditButton(e, note);
                          }}
                        >
                          <EditPencilIcon aria-hidden="true" />
                        </button>
                      </div>
                      <p className="line-clamp-4 text-ellipsis">{note.content}</p>
                    </button>
                  </li>
                ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}
export default NotePreview;
