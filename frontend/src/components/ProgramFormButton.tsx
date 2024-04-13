import { useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { useWindowSize } from "../hooks/useWindowSize";
import { cn } from "../lib/utils";

import { Button } from "./Button";
import ProgramArchiveHeader from "./ProgramForm/ProgramArchive";
import ProgramCancel from "./ProgramForm/ProgramCancel";
import { ProgramInfo } from "./ProgramForm/ProgramInfo";
import { ProgramData } from "./ProgramForm/types";
import { Textfield } from "./Textfield";
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
  const {
    register: archiveRegister,
    reset: archiveReset,
    setValue: setArchiveCalendarValue,
    getValues: getArchiveValue,
  } = useForm<{ date: string }>();

  const [openForm, setOpenForm] = useState(false);
  const [openArchive, setOpenArchive] = useState(false);
  const { width } = useWindowSize().windowSize;
  const isMobile = useMemo(() => width <= 640, [width]);

  const onSubmit: SubmitHandler<ProgramData> = (formData: ProgramData) => {
    setOpenForm(false);
    reset();
    console.log(`${type} program`, formData);
  };

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
            {type === "edit" && (
              <Dialog open={openArchive}>
                <div className="absolute inset-3 flex h-auto justify-end">
                  <DialogTrigger asChild>
                    <Button
                      label="Archive"
                      kind="destructive-secondary"
                      onClick={() => {
                        setOpenArchive(true);
                      }}
                    />
                  </DialogTrigger>
                </div>
                <DialogContentSlide className="w-full bg-white object-right sm:w-[50%]">
                  <div className="flex flex-col justify-center">
                    <div className="pl-24 pr-20">
                      <ProgramArchiveHeader label={data ? data.name : ""} />
                      <p className="pb-3 pt-4 text-sm">Confirm by entering today&apos;s date</p>
                      <form>
                        <Textfield
                          className="mb-12"
                          name="date"
                          placeholder="Date"
                          register={archiveRegister}
                          calendar={true}
                          setCalendarValue={setArchiveCalendarValue}
                        />
                        <div className="flex flex-row gap-3">
                          <DialogClose asChild>
                            <Button
                              label="Back"
                              kind="destructive-secondary"
                              onClick={() => {
                                setOpenArchive(false);
                              }}
                            />
                          </DialogClose>
                          <DialogClose asChild>
                            <Button
                              label="Archive"
                              onClick={() => {
                                const date = new Date(getArchiveValue("date"));
                                const today = new Date();
                                if (
                                  date.getUTCDate() === today.getUTCDate() &&
                                  date.getUTCMonth() === today.getUTCMonth() &&
                                  date.getUTCFullYear() === today.getUTCFullYear()
                                ) {
                                  //set archive to true
                                  archiveReset();
                                  setOpenArchive(false);
                                  setOpenForm(false);
                                }
                              }}
                              kind="destructive"
                            />
                          </DialogClose>
                        </div>{" "}
                      </form>
                    </div>{" "}
                  </div>
                </DialogContentSlide>
              </Dialog>
            )}

            <h2 className="mb-4 text-2xl font-bold text-neutral-800">
              {type === "add" ? "Add new program" : data?.name}
            </h2>
            <ProgramInfo
              classname="w-full"
              register={register}
              data={data ?? null}
              setCalendarValue={setCalendarValue}
            />

            <div className="flex flex-row-reverse gap-3">
              <Button label={type === "add" ? "Create" : "Save Changes"} type="submit" />
              <ProgramCancel
                onSubmit={() => {
                  setOpenForm(false);
                }}
              />
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
          <ProgramCancel
            onSubmit={() => {
              setOpenForm(false);
            }}
            isMobile={isMobile}
          />
          <form onSubmit={handleSubmit(onSubmit)} className={cn(classname)}>
            {type === "edit" && (
              <Dialog open={openArchive}>
                <div className="absolute right-0 top-0 flex max-h-[5%] max-w-[50%] justify-end pr-3 pt-1 pt-4 text-sm text-destructive">
                  <DialogTrigger asChild>
                    <div
                      onClick={() => {
                        setOpenArchive(true);
                      }}
                    >
                      Archive
                    </div>
                  </DialogTrigger>
                </div>
                <DialogContentSlide className="w-full bg-white object-right sm:w-[50%]">
                  <div className="flex flex-col justify-center">
                    <div className="pl-6 pr-6 sm:pl-24 sm:pr-20">
                      <ProgramArchiveHeader label={data ? data.name : ""} />
                      <p className="pb-3 pt-4 text-sm">Confirm by entering today&apos;s date</p>
                      <form>
                        <Textfield
                          className="mb-12"
                          name="date"
                          placeholder="Date"
                          register={archiveRegister}
                          calendar={true}
                          setCalendarValue={setArchiveCalendarValue}
                        />
                        <div className="absolute inset-x-3 bottom-0 flex flex-row gap-3 pb-3">
                          <DialogClose asChild>
                            <Button
                              label="Back"
                              kind="destructive-secondary"
                              size={isMobile ? "wide" : "default"}
                              onClick={() => {
                                setOpenArchive(false);
                              }}
                            />
                          </DialogClose>
                          <DialogClose asChild>
                            <Button
                              label="Archive"
                              size={isMobile ? "wide" : "default"}
                              onClick={() => {
                                const date = new Date(getArchiveValue("date"));
                                const today = new Date();
                                if (
                                  date.getUTCDate() === today.getUTCDate() &&
                                  date.getUTCMonth() === today.getUTCMonth() &&
                                  date.getUTCFullYear() === today.getUTCFullYear()
                                ) {
                                  //set archive to true
                                  archiveReset();
                                  setOpenArchive(false);
                                  setOpenForm(false);
                                }
                              }}
                              kind="destructive"
                            />
                          </DialogClose>
                        </div>{" "}
                      </form>
                    </div>{" "}
                  </div>
                </DialogContentSlide>
              </Dialog>
            )}
            {type === "add" ? (
              <h2 className="pb-6 text-center text-xl font-bold text-neutral-800">
                Add new program
              </h2>
            ) : (
              <h2 className="pb-3 pt-10 text-xl font-bold text-neutral-800">{data?.name}</h2>
            )}

            <ProgramInfo
              classname=""
              register={register}
              data={data ?? null}
              setCalendarValue={setCalendarValue}
            />
            <DialogClose asChild>
              <div className="pt-6">
                <Button
                  size="wide"
                  label={type === "add" ? "Create" : "Save Changes"}
                  type="submit"
                />
              </div>
            </DialogClose>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
