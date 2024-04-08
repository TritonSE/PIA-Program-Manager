import { useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { useWindowSize } from "../hooks/useWindowSize";
import { cn } from "../lib/utils";

import { Button } from "./Button";
import { ProgramInfo } from "./ProgramForm/ProgramInfo";
import { ProgramData } from "./ProgramForm/types";
import { Dialog, DialogClose, DialogContent, DialogContentSlide, DialogTrigger } from "./ui/dialog";

type BaseProperties = {
  classname?: string;
};

type EditProperties = BaseProperties & {
  type: "edit";
  data: ProgramData | null;
};

type AddProperties = BaseProperties & {
  type: "add";
  data?: ProgramData | null;
};

type ProgramFormProperties = EditProperties | AddProperties;

export default function ProgramFormButton({
  type = "edit",
  data = null,
  classname,
}: ProgramFormProperties) {
  const { register, setValue: setCalendarValue, reset, handleSubmit } = useForm<ProgramData>();
  const { width } = useWindowSize();
  const isMobile = useMemo(() => width <= 640, [width]);

  const onSubmit: SubmitHandler<ProgramData> = (formData: ProgramData) => {
    reset();
    console.log(`${type} program`, formData);
  };

  const [openForm, setOpenForm] = useState(false);

  return !isMobile ? (
    <>
      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogTrigger asChild>
          <Button
            label={type === "add" ? "Add Program" : "Edit Program"}
            onClick={() => {
              setOpenForm(true);
            }}
          />
        </DialogTrigger>
        <DialogContentSlide className="w-full bg-white object-right p-6 sm:w-[50%]">
          <form onSubmit={handleSubmit(onSubmit)} className={cn(classname)}>
            <h2 className="mb-4 text-2xl font-bold text-neutral-800">
              {type === "add" ? "Add new program" : data?.name}
            </h2>
            <ProgramInfo
              classname="w-full"
              register={register}
              data={data ?? null}
              setCalendarValue={setCalendarValue}
            />

            <div className="flex flex-row-reverse items-end gap-3">
              <DialogClose asChild>
                <Button label="Create" type="submit" />
              </DialogClose>
              <DialogClose>
                <Button
                  label="Cancel"
                  kind="secondary"
                  onClick={() => {
                    setOpenForm(false);
                  }}
                />
              </DialogClose>
            </div>
          </form>
        </DialogContentSlide>
      </Dialog>
    </>
  ) : (
    <>
      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogTrigger asChild>
          <Button
            label={type === "add" ? "Add Program" : "Edit Program"}
            onClick={() => {
              setOpenForm(true);
            }}
          />
        </DialogTrigger>
        <DialogContent className="bg-white p-3">
          <DialogClose asChild>
            <div className="absolute cursor-pointer pl-3 pt-4 text-sm text-neutral-400">Cancel</div>
          </DialogClose>
          <form onSubmit={handleSubmit(onSubmit)} className={cn(classname)}>
            <h2 className="pb-6 text-center text-xl font-bold text-neutral-800">
              {type === "add" ? "Add new program" : data?.name}
            </h2>
            <ProgramInfo
              classname=""
              register={register}
              data={data ?? null}
              setCalendarValue={setCalendarValue}
            />
            <DialogClose asChild>
              <div className="pt-6">
                <Button size="wide" label="Create" type="submit" />
              </div>
            </DialogClose>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
