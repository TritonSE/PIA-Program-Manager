import Image from "next/image";
import { useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { Program, createProgram, editProgram } from "../api/programs";
import { useWindowSize } from "../hooks/useWindowSize";
import { cn } from "../lib/utils";

import { Button } from "./Button";
import ProgramArchive from "./ProgramForm/ProgramArchive";
import ProgramCancel from "./ProgramForm/ProgramCancel";
import { ProgramInfo } from "./ProgramForm/ProgramInfo";
import { CreateProgramRequest, ProgramData } from "./ProgramForm/types";
import { ProgramMap } from "./StudentsTable/types";
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

  const [openForm, setOpenForm] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const { width } = useWindowSize().windowSize;
  const isMobile = useMemo(() => width <= 640, [width]);

  const onSubmit: SubmitHandler<ProgramData> = (formData: ProgramData) => {
    const sanitizedSessions = formData.sessions
      ? formData.sessions.filter((session: string[]) => session[0] || session[1])
      : [["", ""]];

    const programRequestType = data ? data.type : formData.type; //type selector is disabled when editing

    //If the program type is not regular, then daysOfWeek and sessions will be empty lists.
    const programRequest: CreateProgramRequest = {
      name: formData.name,
      abbreviation: formData.abbreviation,
      type: programRequestType,
      daysOfWeek:
        formData.daysOfWeek && programRequestType === "regular" ? formData.daysOfWeek : [],
      color: formData.color,
      hourlyPay: formData.hourlyPay,
      sessions: programRequestType === "regular" ? sanitizedSessions : [],
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
      const updatedProgram: Program = { ...programRequest, _id: data._id };
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
        <DialogContentSlide
          className="w-full bg-white object-right p-6 sm:w-[50%]"
          onPointerDownOutside={(event) => {
            event.preventDefault();
            setOpenCancel(true);
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className={cn(classname)}>
            {type === "edit" && data && <ProgramArchive setOpenParent={setOpenForm} data={data} />}

            <h2 className="mb-4 text-2xl font-bold text-neutral-800">
              {type === "add" ? "Add new program" : data?.name}
            </h2>
            <ProgramInfo
              classname="w-full"
              register={register}
              data={data ?? null}
              setCalendarValue={setCalendarValue}
              mode={type}
            />

            <div className="flex flex-row-reverse gap-3">
              <Button label={type === "add" ? "Create" : "Save Changes"} type="submit" />
              <ProgramCancel
                isMobile={isMobile}
                open={openCancel}
                setOpen={setOpenCancel}
                onCancel={() => {
                  setOpenCancel(false);
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
            open={openCancel}
            setOpen={setOpenCancel}
            onCancel={() => {
              setOpenForm(false);
              reset();
            }}
          />
          <form onSubmit={handleSubmit(onSubmit)} className={cn(classname)}>
            {type === "edit" && data && (
              <ProgramArchive setOpenParent={setOpenForm} data={data} isMobile={isMobile} />
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
              mode={type}
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
