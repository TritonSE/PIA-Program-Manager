import { forwardRef } from "react";

import { Button } from "../Button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "../ui/dialog";

type ModalConfirmationProps = {
  ref?: React.RefObject<HTMLDivElement>;
  icon: React.ReactNode;
  triggerElement: React.ReactNode;
  onCancelClick?: (e: React.MouseEvent) => void;
  onConfirmClick?: (e: React.MouseEvent) => void;
  title: string;
  description?: string;
  cancelText?: string;
  confirmText: string;
  kind: "primary" | "destructive";
  nestedDialog?: React.ReactNode;
  //Used for nested dialog to close parent dialog
  isParentOpen?: boolean;
  setIsParentOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

const ModalConfirmation = forwardRef<HTMLDivElement, ModalConfirmationProps>(
  (
    {
      icon,
      triggerElement,
      onCancelClick = () => {},
      onConfirmClick = () => {},
      title,
      description,
      cancelText = "Cancel",
      confirmText,
      kind,
      nestedDialog,
      isParentOpen,
      setIsParentOpen,
    },
    ref,
  ) => {
    return (
      <Dialog open={isParentOpen} onOpenChange={setIsParentOpen}>
        <DialogTrigger asChild>{triggerElement}</DialogTrigger>
        <DialogContent
          ref={ref}
          className="max-h-[50%] max-w-[80%] rounded-[8px] md:max-w-[50%] lg:max-w-[25%]"
        >
          <div className="grid place-items-center p-3 min-[450px]:p-10">
            <div className="mb-8">{icon}</div>
            <h3 className="text-bold mb-2 text-lg font-bold">{title}</h3>
            {description ? <p>{description}</p> : null}
            <div className="grid justify-center gap-5 pt-6 min-[450px]:flex min-[450px]:w-[70%] min-[450px]:justify-between min-[450px]:[&>*]:basis-full">
              <DialogClose asChild>
                <Button
                  label={cancelText}
                  kind={kind === "primary" ? "secondary" : "destructive-secondary"}
                  onClick={onCancelClick}
                />
              </DialogClose>
              {nestedDialog ? (
                nestedDialog
              ) : (
                <DialogClose asChild>
                  <Button label={confirmText} kind={kind} onClick={onConfirmClick} />
                </DialogClose>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  },
);

ModalConfirmation.displayName = "ModalConfirmation";

export default ModalConfirmation;
