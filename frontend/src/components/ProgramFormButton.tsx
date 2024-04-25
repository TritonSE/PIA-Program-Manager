import Image from "next/image";
import { MouseEventHandler, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { Program, archiveProgram, createProgram, editProgram } from "../api/programs";
import { useWindowSize } from "../hooks/useWindowSize";
import { cn } from "../lib/utils";

import { Button } from "./Button";
import ProgramArchiveHeader from "./ProgramForm/ProgramArchive";
import ProgramCancel from "./ProgramForm/ProgramCancel";
import { ProgramInfo } from "./ProgramForm/ProgramInfo";
import { CreateProgramRequest, ProgramData } from "./ProgramForm/types";
import { ProgramMap } from "./StudentsTable/types";
import { Textfield } from "./Textfield";
import { Dialog, DialogClose, DialogContent, DialogContentSlide, DialogTrigger } from "./ui/dialog";

type BaseProperties = {
  classname?: string;
  setPrograms: React.Dispatch<React.SetStateAction<ProgramMap>>;
};

type EditProperties = BaseProperties & {
  type: "edit";
  data: Program | null;
};

type AddProperties = BaseProperties & {
  type: "add";
  data?: Program | null;
};

type ProgramFormProperties = EditProperties | AddProperties;

export default function ProgramFormButton({
  type = "edit",
  data = null,
  setPrograms,
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

  const archive: MouseEventHandler = () => {
    // This function should only call in edit mode, which requires data to exist.
    // the following conditional is required to make lint happy
    if (!data) {
      alert("Illegal archiving of non-existent program");
      return;
    }

    const date = new Date(getArchiveValue("date"));
    const today = new Date();
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      archiveProgram(data)
        .then((result) => {
          if (result.success) {
            console.log("Archive success");
            archiveReset();
            setOpenArchive(false);
            setOpenForm(false);
          } else {
            console.log(result.error);
            alert("Unable to archive program: " + result.error);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const onSubmit: SubmitHandler<ProgramData> = (formData: ProgramData) => {
    const sanitizedSessions = formData.sessions
      ? formData.sessions.filter((session: string[]) => session[0] || session[1])
      : [["", ""]];

    const programRequest: CreateProgramRequest = {
      name: formData.name,
      abbreviation: formData.abbreviation,
      type: formData.type,
      daysOfWeek: formData.days ? formData.days : [],
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      color: formData.color,
      renewalDate: new Date(formData.renewalDate),
      hourly: formData.hourly,
      sessions: sanitizedSessions,
    };
    console.log(`${type} program`, programRequest);
    if (type === "add") {
      createProgram(programRequest)
        .then((result) => {
          if (result.success) {
            setOpenForm(false);
            console.log(`${type} program`, result.data);
            setPrograms((prevPrograms: ProgramMap) => {
              return { ...prevPrograms, [result.data._id]: { ...result.data } };
            });
            reset();
          } else {
            console.log(result.error);
            alert("Unable to create program: " + result.error);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (type === "edit" && data) {
      const updatedProgram: Program = { ...programRequest, _id: data._id, students: data.students };
      console.log(`${type} program`, updatedProgram);
      editProgram(updatedProgram)
        .then((result) => {
          if (result.success) {
            setOpenForm(false);
            console.log(`${type} program`, result.data);
            setPrograms((prevPrograms: ProgramMap) => {
              if (Object.keys(prevPrograms).includes(result.data._id))
                return { ...prevPrograms, [result.data._id]: { ...result.data } };
              else console.log("Program ID does not exist");
              alert("Program ID does not exist");
              return prevPrograms;
            });
          } else {
            console.log(result.error);
            alert("Unable to create program: " + result.error);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return !isMobile ? (
    <>
      <Dialog open={openForm} onOpenChange={setOpenForm}>
        {type === "add" && (
          <DialogTrigger asChild>
            <Button
              label="Add Program"
              onClick={() => {
                setOpenForm(true);
              }}
            />
          </DialogTrigger>
        )}
        {type === "edit" && (
          <DialogTrigger asChild>
            <Image
              alt="options"
              src="/programs/Options.png"
              height={18}
              width={16}
              className={"relative float-right hover:cursor-pointer"}
            />
          </DialogTrigger>
        )}
        <DialogContentSlide className="w-full bg-white object-right p-6 sm:w-[50%]">
          <form onSubmit={handleSubmit(onSubmit)} className={cn(classname)}>
            {type === "edit" && (
              <Dialog open={openArchive}>
                <div className="absolute inset-3 flex h-auto justify-end">
                  <DialogTrigger asChild>
                    {
                      <Button
                        label="Archive"
                        kind="destructive-secondary"
                        onClick={() => {
                          setOpenArchive(true);
                        }}
                      />
                    }
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
                            <Button label="Archive" onClick={archive} kind="destructive" />
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
                onCancel={() => {
                  setOpenForm(false);
                  reset();
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
        {type === "add" && (
          <DialogTrigger asChild>
            <Button
              label="Add Program"
              onClick={() => {
                setOpenForm(true);
              }}
            />
          </DialogTrigger>
        )}
        {type === "edit" && (
          <DialogTrigger asChild>
            <Image
              alt="options"
              src="/programs/Options.png"
              height={9}
              width={8}
              className={"relative float-right hover:cursor-pointer"}
            />
          </DialogTrigger>
        )}
        <DialogContent className="bg-white p-3">
          <ProgramCancel
            isMobile={isMobile}
            onCancel={() => {
              setOpenForm(false);
              reset();
            }}
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
                              onClick={archive}
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
