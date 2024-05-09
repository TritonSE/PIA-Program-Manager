import React from "react";

import RedQuestionMarkIcon from "../../public/icons/red_question_mark.svg";

import { Button } from "./Button";
import ModalConfirmation from "./ModalConfirmation";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

type SaveCancelButtonsPropsBase = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onCancelClick?: (e: React.MouseEvent) => void;
  onSaveClick?: (e: React.MouseEvent) => void;
  onLeave?: () => void;
};

type SaveCancelButtonsPropsWithAutoClose = SaveCancelButtonsPropsBase & {
  isOpen: boolean;
  //Children is used for save button dialog content
  children?: React.ReactNode;
  //Will automatically close save button dialog after specified time in seconds
  automaticClose: number;
};

type SaveCancelButtonsPropsWithoutAutoClose = SaveCancelButtonsPropsBase & {
  isOpen?: never;
  automaticClose?: never;
  children?: never;
};

type SaveCancelButtonsProps =
  | SaveCancelButtonsPropsWithAutoClose
  | SaveCancelButtonsPropsWithoutAutoClose;

export default function SaveCancelButtons({
  isOpen,
  setOpen,
  onCancelClick,
  onSaveClick,
  onLeave,
  automaticClose,
  children,
}: SaveCancelButtonsProps) {
  const handleAutomaticClose = () => {
    if (automaticClose) {
      setTimeout(() => {
        setOpen(false);
      }, automaticClose * 1000);
    }
  };

  return (
    <div className="ml-auto mt-5 flex w-fit gap-5">
      <ModalConfirmation
        icon={<RedQuestionMarkIcon />}
        triggerElement={<Button label="Cancel" kind="secondary" onClick={onCancelClick} />}
        onConfirmClick={() => {
          if (setOpen) setOpen(false);
          if (onLeave) onLeave();
        }}
        title="Are you sure you want to leave?"
        confirmText="Leave"
        kind="destructive"
      />
      {/* If there is no children, save button closes by default, otherwise show children as save button dialog content */}
      {!children ? (
        <Button label="Save Changes" onClick={onSaveClick} />
      ) : (
        <Dialog open={isOpen} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              label="Save Changes"
              onClick={(e) => {
                setOpen(true);
                if (onSaveClick) onSaveClick(e);
                handleAutomaticClose();
              }}
            />
          </DialogTrigger>
          <DialogContent className="max-h-[30%] w-fit max-w-[80%] rounded-[8px] md:max-w-[50%] lg:max-w-[30%]">
            {children}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
