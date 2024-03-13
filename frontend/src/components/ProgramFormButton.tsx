import { useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { useWindowSize } from "../hooks/useWindowSize";
import { cn } from "../lib/utils";

import { Button } from "./Button";
import ProgramInfo from "./ProgramForm/ProgramInfo";
import { ProgramData } from "./ProgramForm/types";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "./ui/dialog";
import { ColorRadio } from "./Radio";

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
        <DialogContent className="max-w-screen h-auto w-full rounded-lg bg-white p-6 sm:w-[50%]">
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

            <div className="flex flex-row items-end gap-3">
              <div className="stretch flex w-full flex-col items-start gap-2">
                <div className="text-center text-base font-normal text-neutral-400">
                  Color (Cover)
                </div>

                <ColorRadio
                  options={["teal", "yellow", "red", "green"]}
                  name="color"
                  register={register}
                />
              </div>
              <DialogClose>
                <Button
                  label="Cancel"
                  kind="secondary"
                  onClick={() => {
                    setOpenForm(false);
                  }}
                />
              </DialogClose>
              <DialogClose asChild>
                <Button label="Create" type="submit" />
              </DialogClose>
            </div>
          </form>
        </DialogContent>
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
        <DialogContent className="h-screen w-full rounded-lg bg-white p-6 sm:w-[50%]">
          <form onSubmit={handleSubmit(onSubmit)} className={cn(classname)}>
            <h2 className="mb-4 text-2xl font-bold text-neutral-800">
              {type === "add" ? "Add new program" : data?.name}
            </h2>
            <ProgramInfo
              classname=""
              register={register}
              data={data ?? null}
              setCalendarValue={setCalendarValue}
            />
            <div className="stretch mb-4 flex w-full flex-col items-start gap-2">
              <div className="text-center text-base font-normal text-neutral-400">
                Color (Cover)
              </div>
              <ColorRadio
                options={["teal", "yellow", "red", "green"]}
                name="color"
                register={register}
              />
            </div>

            <DialogClose asChild>
              <Button className="stretch" label="Create" type="submit" />
            </DialogClose>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
