import { useContext, useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { Program, createProgram, editProgram } from "../api/programs";
import { UserContext } from "../contexts/user";
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
  component: React.JSX.Element;
  setPrograms: React.Dispatch<React.SetStateAction<ProgramMap>>;
  setAlertState: React.Dispatch<React.SetStateAction<{ open: boolean; message: string }>>;
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
  component = <p>Please add a component</p>,
  data = null,
  setPrograms,
  setAlertState,
  classname,
}: ProgramFormProperties) {
  const { register, setValue: setCalendarValue, reset, handleSubmit } = useForm<ProgramData>();

  const { firebaseUser } = useContext(UserContext);
  const [openForm, setOpenForm] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const { width } = useWindowSize().windowSize;
  const isMobile = useMemo(() => width <= 640, [width]);
  const [firebaseToken, setFirebaseToken] = useState<string>();

  useEffect(() => {
    if (firebaseUser) {
      firebaseUser
        .getIdToken()
        .then((token) => {
          setFirebaseToken(token);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [firebaseUser]);

  const onSubmit: SubmitHandler<ProgramData> = (formData: ProgramData) => {
    if (!firebaseToken) return;

    const sanitizedSessions = formData.sessions
      ? formData.sessions.map((session: string[]) =>
          session[0] && session[1]
            ? { start_time: session[0], end_time: session[1] }
            : { start_time: "", end_time: "" },
        )
      : [{ start_time: "", end_time: "" }];

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
      archived: formData.archived ? formData.archived : false,
    };

    console.log(`${type} program`, programRequest);
    if (type === "add") {
      createProgram(programRequest, firebaseToken)
        .then((result) => {
          if (result.success) {
            setOpenForm(false);
            console.log(`${type} program`, result.data);
            setAlertState({ open: true, message: "Added program " + result.data.name });
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
      const updatedProgram: Program = {
        ...programRequest,
        _id: data._id,
        dateUpdated: data.dateUpdated,
      };
      console.log(`${type} program`, updatedProgram);
      editProgram(updatedProgram, firebaseToken)
        .then((result) => {
          if (result.success) {
            setOpenForm(false);
            console.log(`${type} program`, result.data);
            setAlertState({ open: true, message: "Edited program " + result.data.name });
            setPrograms((prevPrograms: ProgramMap) => {
              if (Object.keys(prevPrograms).includes(result.data._id))
                return { ...prevPrograms, [result.data._id]: { ...result.data } };
              else console.log("Program ID does not exist");
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
        <DialogTrigger asChild>{component}</DialogTrigger>
        <DialogContentSlide
          className="w-full bg-white object-right p-6 sm:w-[50%]"
          onPointerDownOutside={(event) => {
            event.preventDefault();
            setOpenCancel(true);
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className={cn(classname)}>
            {type === "edit" && data && (
              <ProgramArchive
                setOpenParent={setOpenForm}
                data={data}
                setPrograms={setPrograms}
                setAlertState={setAlertState}
              />
            )}

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
        <DialogTrigger asChild>{component}</DialogTrigger>
        <DialogContent className="bg-white p-3">
          <ProgramCancel
            isMobile={isMobile}
            open={openCancel}
            setOpen={setOpenCancel}
            onCancel={() => {
              setOpenForm(false);
              setOpenCancel(false);
              reset();
            }}
          />
          <form onSubmit={handleSubmit(onSubmit)} className={cn(classname)}>
            {type === "edit" && data && (
              <ProgramArchive
                setOpenParent={setOpenForm}
                data={data}
                isMobile={isMobile}
                setPrograms={setPrograms}
                setAlertState={setAlertState}
              />
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
