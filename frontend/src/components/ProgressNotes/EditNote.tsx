import { useContext, useEffect, useRef, useState } from "react";

import BackIcon from "../../../public/icons/back.svg";
import CloseIcon from "../../../public/icons/close.svg";
import DeleteIcon from "../../../public/icons/delete.svg";
import EditIcon from "../../../public/icons/edit.svg";
import GreenCheckMarkIcon from "../../../public/icons/green_check_mark.svg";
import RedDeleteIcon from "../../../public/icons/red_delete.svg";
import { Button } from "../Button";
import ModalConfirmation from "../Modals/ModalConfirmation";
import SaveCancelButtons from "../Modals/SaveCancelButtons";

import { dateOptions } from "./NotesSelectionList";
import { ProgressNote } from "./types";

import { createProgressNote, deleteProgressNote, editProgressNote } from "@/api/progressNotes";
import { UserContext } from "@/contexts/user";
import { HandleNoteUpdate, StudentWithNotes, ViewMode } from "@/pages/notes";

type EditNoteProps = {
  selectedStudent: StudentWithNotes;
  selectedNote: ProgressNote;
  firebaseToken: string;
  handleBackButton: () => void;
  handleEditButton: (e: React.MouseEvent, note: ProgressNote) => void;
  handleNoteUpdate: (data: HandleNoteUpdate) => void;
  handleFinishDelete: () => void;
  noteMode: ViewMode;
};

function EditNote({
  selectedStudent,
  selectedNote,
  firebaseToken,
  handleBackButton,
  handleEditButton,
  handleNoteUpdate,
  handleFinishDelete,
  noteMode,
}: EditNoteProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletedNote, setDeletedNote] = useState<ProgressNote | undefined>(undefined);
  const deleteDialogRef = useRef<HTMLDivElement>(null);
  const { piaUser, isAdmin } = useContext(UserContext);
  const currentUser = piaUser?.name;

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const noteContent = inputRef.current?.value ?? "";
    if (noteContent === "") {
      return;
    }

    if (noteMode === "add") {
      createProgressNote(selectedStudent._id, new Date(), noteContent, firebaseToken).then(
        (result) => {
          if (result.success) {
            handleNoteUpdate({ action: "add", noteData: result.data });
          } else {
            console.error(result.error);
          }
        },
        (error) => {
          console.error(error);
        },
      );
    } else if (noteMode === "edit") {
      editProgressNote(selectedNote._id, new Date(), noteContent, firebaseToken).then(
        (result) => {
          if (result.success) {
            handleNoteUpdate({ action: "edit", noteData: result.data });
          } else {
            console.error(result.error);
          }
        },
        (error) => {
          console.error(error);
        },
      );
    }
  };

  const handleDelete = () => {
    setDeletedNote(selectedNote);
    deleteProgressNote(selectedNote._id, selectedStudent._id, firebaseToken).then(
      (result) => {
        if (result.success) {
          handleNoteUpdate({ action: "delete", noteData: result.data });
        } else {
          console.error(result.error);
        }
      },
      (error) => {
        console.error(error);
      },
    );
  };

  const handleUndoDelete = () => {
    if (deletedNote) {
      createProgressNote(
        deletedNote.studentId,
        deletedNote.dateLastUpdated,
        deletedNote.content,
        firebaseToken,
      ).then(
        (result) => {
          if (result.success) {
            handleNoteUpdate({ action: "add", noteData: result.data });
          } else {
            console.error(result.error);
          }
        },
        (error) => {
          console.error(error);
        },
      );
      setDeletedNote(undefined);
    }
  };

  useEffect(() => {
    if (noteMode === "edit" && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.selectionStart = inputRef.current.value.length;
    }
  }, [noteMode]);

  useEffect(() => {
    // If the dialog closes after deleting a note
    if (!openDeleteDialog && deleteDialogRef.current?.style.opacity === "0") {
      handleFinishDelete();
    }
  }, [openDeleteDialog]);

  return (
    <article className="flex h-full flex-col px-8 py-3 sm:py-7">
      <div className="flex justify-between pb-5">
        <button onClick={handleBackButton}>
          <BackIcon />
        </button>
        {isAdmin ? (
          <div className="flex gap-3">
            <button
              onClick={(e: React.MouseEvent) => {
                handleEditButton(e, selectedNote);
              }}
            >
              <EditIcon
                className={
                  noteMode === "edit"
                    ? "text-pia_dark_green"
                    : "transition-colors hover:text-pia_dark_green"
                }
              />
            </button>
            <ModalConfirmation
              ref={deleteDialogRef}
              icon={<RedDeleteIcon />}
              triggerElement={
                <button>
                  <DeleteIcon className="transition-colors hover:text-pia_dark_green" />
                </button>
              }
              title="Are you sure you want to delete?"
              confirmText="Delete"
              kind="destructive"
              isParentOpen={openDeleteDialog}
              setIsParentOpen={setOpenDeleteDialog}
              nestedDialog={
                <ModalConfirmation
                  icon={<GreenCheckMarkIcon />}
                  triggerElement={
                    <Button
                      label="Delete"
                      kind="destructive"
                      // This onClick is the same as onConfirmClick for parent dialog
                      // Fixes small visual bug when parent dialog closes slightly after child dialog
                      onClick={() => {
                        if (deleteDialogRef.current) deleteDialogRef.current.style.opacity = "0";
                        handleDelete();
                      }}
                    />
                  }
                  title="Notes have been deleted"
                  cancelText="Undo"
                  confirmText="Done"
                  onCancelClick={handleUndoDelete}
                  setIsParentOpen={setOpenDeleteDialog}
                  kind="primary"
                />
              }
            />
          </div>
        ) : null}
      </div>
      <h2 className="text-2xl font-bold">
        Notes for {`${selectedStudent.student.firstName} ${selectedStudent.student.lastName}`}
      </h2>
      <div className="flex h-full flex-col">
        {noteMode === "view" ? (
          <p className="py-4 text-[#929292]">
            {new Date(selectedNote.dateLastUpdated).toLocaleDateString("en-US", dateOptions)}
            &nbsp;| By {selectedNote.lastEditedBy}
          </p>
        ) : (
          <p className="py-4 text-[#929292]">
            {new Date().toLocaleDateString("en-US", dateOptions)}
            &nbsp;| By {currentUser}
          </p>
        )}
        <textarea
          autoFocus
          readOnly={noteMode === "view"}
          ref={inputRef}
          className="scrollbar h-full w-full resize-none overflow-auto outline-none"
          defaultValue={selectedNote.content}
        />
        {noteMode !== "view" && (
          <SaveCancelButtons
            isOpen={openSaveDialog}
            onSaveClick={handleSaveClick}
            automaticClose={1.5} //1.5 seconds
            setOpen={setOpenSaveDialog}
            onLeave={handleBackButton}
            saveText="Save"
            sameSize
          >
            {/* Save Dialog Content */}
            <div className="grid place-items-center p-3 min-[450px]:px-12 min-[450px]:pb-12 min-[450px]:pt-10">
              <button
                className="ml-auto"
                onClick={() => {
                  setOpenSaveDialog(false);
                }}
              >
                <CloseIcon />
              </button>
              <GreenCheckMarkIcon className="mb-5" />
              <h3 className="text-lg font-bold">Progress note has been saved!</h3>
            </div>
          </SaveCancelButtons>
        )}
      </div>
    </article>
  );
}
export default EditNote;
