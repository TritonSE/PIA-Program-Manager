import React from "react";

import { Button } from "./Button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "./ui/dialog";

type SaveCancelButtonsProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SaveCancelButtons({ setOpen }: SaveCancelButtonsProps) {
  return (
    <div className="ml-auto mt-5 flex w-fit gap-5">
      <Dialog>
        <DialogTrigger asChild>
          <Button label="Cancel" kind="secondary" />
        </DialogTrigger>
        <DialogContent className="max-h-[30%] max-w-[80%] rounded-[8px] md:max-w-[50%]  lg:max-w-[30%]">
          <div className="p-3 min-[450px]:p-10">
            <p className="my-10 text-center">Leave without saving changes?</p>
            <div className="grid justify-center gap-5 min-[450px]:flex min-[450px]:justify-between">
              <DialogClose asChild>
                <Button label="Back" kind="secondary" />
              </DialogClose>
              <DialogClose asChild>
                <Button
                  label="Continue"
                  onClick={() => {
                    if (setOpen) setOpen(false);
                  }}
                />
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <DialogClose asChild>
        <Button label="Save Changes" type="submit" />
      </DialogClose>
    </div>
  );
}
