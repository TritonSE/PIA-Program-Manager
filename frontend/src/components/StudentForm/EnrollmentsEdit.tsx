import Image from "next/image";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  FieldArrayWithId,
  Path,
  UseFormRegister,
  useFieldArray,
  useFormContext,
} from "react-hook-form";

import { Student } from "../../api/students";
import { ProgramsContext } from "../../contexts/program";
import { cn } from "../../lib/utils";
import { Dropdown } from "../Dropdown";
import { Textfield } from "../Textfield";

import { convertDateToString } from "./StudentBackground";
import { StatusOptions, StudentFormData } from "./types";

import { amPmToTime, timeToAmPm } from "@/lib/sessionTimeParsing";

type EnrollmentsEditProps = {
  classname?: string;
  data: Student | null;
  varying: boolean;
};

export const emptyEnrollment = {
  studentId: "",
  programId: "",
  status: "",
  dateUpdated: new Date(),
  hoursLeft: 0,
  schedule: [] as string[],
  sessionTime: {
    start_time: "",
    end_time: "",
  },
  startDate: "",
  renewalDate: "",
  authNumber: "",
  varying: false,
};

// Adapted types from ProgramInfo.tsx
type CheckcircleProps = {
  options: string[];
  className?: string;
  name: Path<StudentFormData>;
  register: UseFormRegister<StudentFormData>;
  data: string[] | undefined;
};

export function Checkcircle({ options, className, name, register, data }: CheckcircleProps) {
  return (
    <div className={cn("flex flex-row gap-2 sm:gap-3", className)}>
      {options.map((option, index) => {
        return (
          <div
            className="relative flex items-center overflow-hidden rounded-full"
            key={option + index}
          >
            <input
              {...register(name)}
              className="peer flex h-10 w-10 appearance-none rounded-full border-[1px] border-pia_border transition-colors hover:cursor-pointer hover:bg-[#00686766] focus-visible:bg-[#00686766] sm:h-12 sm:w-12 sm:border-[2px]"
              id={option + index}
              type="checkbox"
              value={option}
              defaultChecked={data?.includes(option)}
            />
            <div className="pointer-events-none absolute flex h-full w-full items-center justify-center text-sm text-neutral-800 peer-checked:bg-pia_dark_green peer-checked:text-white sm:text-base">
              {option}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// item is the enrollment object, index is the index of the enrollment in the array
const EnrollmentFormItem = ({
  item,
  index,
  allPrograms,
  fieldName,
  varying,
}: {
  item: FieldArrayWithId<StudentFormData, "regularEnrollments" | "varyingEnrollments">;
  index: number;
  allPrograms: string[];
  fieldName: "regularEnrollments" | "varyingEnrollments";
  varying: boolean;
}) => {
  const textFields = [
    {
      name: "Start Date",
      fieldName: `${fieldName}.${index}.startDate`,
      placeholder: "00/00/0000",
      calendar: true,
      defaultValue: item.startDate,
    },
    {
      name: "Renewal Date",
      fieldName: `${fieldName}.${index}.renewalDate`,
      placeholder: "00/00/0000",
      calendar: true,
      defaultValue: item.renewalDate,
    },
    {
      name: "Authorization Code",
      fieldName: `${fieldName}.${index}.authNumber`,
      placeholder: "123456",
      defaultValue: item.authNumber,
    },
  ];
  const { allPrograms: programsMap } = useContext(ProgramsContext);
  const { register, setValue } = useFormContext<StudentFormData>();
  const initialTime =
    item.sessionTime.start_time === ""
      ? ""
      : `${timeToAmPm(item.sessionTime.start_time)} - ${timeToAmPm(item.sessionTime.end_time)}`;
  // const initialTime = "0:00 AM - 0:00 AM";
  const [selectedSession, setSelectedSession] = useState(item.sessionTime);
  const [selectedStatus, setSelectedStatus] = useState<string>(item.status);
  const [selectedProgram, setSelectedProgram] = useState<string>("");

  const sessionOptions = useMemo(() => {
    return (
      programsMap[item.programId]?.sessions?.map((timeSlot) => {
        return `${timeToAmPm(timeSlot.start_time)} - ${timeToAmPm(timeSlot.end_time)}`;
      }) || []
    );
  }, [item.programId]);

  // these 3 useEffects keep our custom dropdown and react-hook-form in sync
  const calculateHoursLeft = (
    startDate: Date,
    endDate: Date,
    daysOfWeek: string[],
    sessionStartTime: string,
    sessionEndTime: string,
  ): number => {
    console.log(startDate, endDate, daysOfWeek, sessionStartTime, sessionEndTime);
    const dayMap = {
      Su: "Sunday",
      M: "Monday",
      T: "Tuesday",
      W: "Wednesday",
      Th: "Thursday",
      F: "Friday",
      Sa: "Saturday",
    };

    const createDateWithTime = (time: string): Date => {
      const [hours, minutes] = time.split(":").map((t) => parseInt(t));
      const newDate = new Date();
      newDate.setHours(hours);
      newDate.setMinutes(minutes);
      return newDate;
    };

    const days = [];
    for (const day of daysOfWeek) {
      days.push(dayMap[day as keyof typeof dayMap]);
    }

    const sessionStart = createDateWithTime(sessionStartTime);
    const sessionEnd = createDateWithTime(sessionEndTime);
    const sessionLength = (sessionEnd.getTime() - sessionStart.getTime()) / 1000 / 60 / 60;

    let totalHours = 0;

    for (let d = new Date(startDate); d <= new Date(endDate); d.setDate(d.getDate() + 1)) {
      if (days.includes(d.toLocaleString("en-US", { weekday: "long" }))) {
        totalHours += sessionLength;
      }
    }
    console.log(totalHours);

    return totalHours;
  };

  useEffect(() => {
    item.sessionTime = selectedSession;
    setValue(`${fieldName}.${index}.sessionTime`, selectedSession);
    if (!varying && selectedSession.start_time && selectedSession.end_time) {
      setValue(
        `${fieldName}.${index}.hoursLeft`,
        calculateHoursLeft(
          new Date(item.startDate),
          new Date(item.renewalDate),
          item.schedule,
          selectedSession.start_time,
          selectedSession.end_time,
        ),
      );
    }
  }, [selectedSession]);

  useEffect(() => {
    const progId = Object.keys(programsMap).find(
      (key) => programsMap[key].abbreviation === selectedProgram,
    );
    if (progId) {
      item.programId = progId;
      setValue(`${fieldName}.${index}.programId`, progId);
    }
    setSelectedSession({ start_time: "", end_time: "" });
  }, [selectedProgram]);

  useEffect(() => {
    setValue(`${fieldName}.${index}.status`, selectedStatus);
  }, [selectedStatus]);

  return (
    <>
      <div className="mb-5 grid w-full gap-x-3 gap-y-5 md:grid-cols-2">
        <div>
          <h3>Program Name</h3>
          <Dropdown
            name="name"
            placeholder="Select Program"
            className={`h-[50px] w-full rounded-md`}
            options={allPrograms}
            initialValue={programsMap[item.programId]?.abbreviation}
            onChange={(value): void => {
              setSelectedProgram(value);
            }}
          />
        </div>
        <div>
          <h3>Status</h3>
          <Dropdown
            name="status"
            placeholder="Select Status"
            className={`h-[50px] w-full rounded-md`}
            initialValue={item.status}
            options={useMemo(() => Object.values(StatusOptions), [StatusOptions])}
            onChange={(value): void => {
              setSelectedStatus(value);
            }}
          />
        </div>
        {textFields.map((cur, i) => {
          return (
            <div key={i}>
              <h3>{cur.name}</h3>
              <Textfield
                register={register}
                name={cur.fieldName as keyof StudentFormData}
                placeholder={cur.placeholder}
                calendar={cur.calendar}
                setCalendarValue={cur.calendar ? setValue : undefined}
                defaultValue={cur.defaultValue}
              />
            </div>
          );
        })}
        {!varying && (
          <div>
            <h3>Session</h3>
            <Dropdown
              name="sessions"
              placeholder="Select Session"
              className={`h-[50px] w-full rounded-md`}
              options={sessionOptions}
              initialValue={initialTime}
              onChange={(value): void => {
                setSelectedSession(amPmToTime(value));
              }}
            />
          </div>
        )}

        {varying && (
          <div>
            <h3>Hours Left</h3>
            <Textfield
              register={register}
              name={`${fieldName}.${index}.hoursLeft`}
              placeholder="0"
              defaultValue="0"
              type="number"
              handleInputChange={(e) => {
                console.log(e.target.value);
                setValue(`${fieldName}.${index}.hoursLeft`, Number(e.target.value));
              }}
            />
          </div>
        )}

        {/* <button
          type="button"
          onClick={() => {
            remove(index);
          }}
        >
          <Image src="../trash.svg" alt="remove program" height="20" width="20" />
        </button> */}
      </div>

      {varying && (
        <Checkcircle
          register={register}
          name={`${fieldName}.${index}.schedule`}
          options={["Su", "M", "T", "W", "Th", "F", "Sa"]}
          data={item.schedule}
        />
      )}
    </>
  );
};

function EnrollmentsEdit({ classname, data, varying }: EnrollmentsEditProps) {
  const { control, watch } = useFormContext<StudentFormData>();
  const { allPrograms: programsMap } = useContext(ProgramsContext);

  // used for dropdown options
  const varyingPrograms = useMemo(
    () =>
      Object.values(programsMap)
        .filter((program) => program.type === "varying")
        .map((program) => program.abbreviation),
    [programsMap],
  );
  const regularPrograms = useMemo(
    () =>
      Object.values(programsMap)
        .filter((program) => program.type === "regular")
        .map((program) => program.abbreviation),
    [programsMap],
  );

  const fieldName = varying ? "varyingEnrollments" : "regularEnrollments";
  const { fields, append, update } = useFieldArray({
    control,
    name: fieldName,
    shouldUnregister: true,
  });

  watch(fieldName, fields);

  useEffect(() => {
    if (data) {
      data.enrollments
        .filter((enrollment) => {
          if (varying) {
            return programsMap[enrollment.programId].type === "varying";
          } else {
            return programsMap[enrollment.programId].type === "regular";
          }
        })
        .forEach((enrollment, index) => {
          console.log(varying);
          update(index, {
            ...enrollment,
            varying,
            dateUpdated: new Date(enrollment.dateUpdated),
            // messy way to format dates since mongo returns them as strings with exact time
            startDate: convertDateToString(new Date(enrollment.startDate)),
            renewalDate: convertDateToString(new Date(enrollment.renewalDate)),
          });
        });
    }
  }, [data]);

  if (!programsMap) return null;

  return (
    <div className={cn("grid w-full gap-5", classname)}>
      <div className="grid gap-y-5">
        <span className="align-center flex w-full justify-between">
          <h3>{varying ? "Varying" : "Regular"} Programs</h3>
          <button
            className="flex gap-2"
            onClick={(e) => {
              e.preventDefault();
              append({ ...emptyEnrollment, varying });
            }}
          >
            <Image src="/plus.svg" alt="add program" height="20" width="20" />
            <span className="leading-normal tracking-tight">Add Program</span>
          </button>
        </span>
        <ul className="flex flex-col gap-10">
          {fields
            .filter(
              (enrollment) =>
                // if we have a program id present, we can filter by whether it is regular or varying, otherwise its probably a new entry
                !enrollment.programId ||
                (varying
                  ? programsMap[enrollment.programId]?.type === "varying"
                  : programsMap[enrollment.programId]?.type === "regular"),
            )
            .map((item, index) => {
              return (
                <li key={item.id}>
                  <EnrollmentFormItem
                    item={item}
                    index={index}
                    allPrograms={varying ? varyingPrograms : regularPrograms}
                    fieldName={fieldName}
                    varying={varying}
                  />
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}

export default EnrollmentsEdit;
