import BackIcon from "../../../../../public/icons/back.svg";
import CloseIcon from "../../../../../public/icons/close.svg";

import { DialogClose, DialogContent } from "@/components/ui/dialog";

type ProfileDialogProps = {
  children: React.ReactNode;
  title: string;
  description?: string;
  backIcon?: boolean;
  onBackClick?: () => void;
};

export default function ProfileDialogContent({
  children,
  title,
  description = "",
  backIcon = false,
  onBackClick,
}: ProfileDialogProps) {
  return (
    <DialogContent className="max-h-[95%] max-w-[90%] rounded-[13px] sm:max-w-[500px]">
      <div className="grid gap-5 px-[40px] py-[30px]">
        {backIcon ? (
          <button
            onClick={onBackClick}
            className="w-fit transition-opacity hover:opacity-50"
            aria-label="Go Back"
          >
            <BackIcon aria-hidden="true" />
          </button>
        ) : (
          <DialogClose className="my-2 ml-auto outline-offset-8 transition-opacity hover:opacity-50 focus-visible:opacity-50">
            <CloseIcon aria-hidden="true" />
          </DialogClose>
        )}
        <h2 className="text-xl sm:text-2xl ">{title}</h2>
        {description ? <p>{description}</p> : ""}
        {children}
      </div>
    </DialogContent>
  );
}
