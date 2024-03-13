import { UseFormRegister, UseFormSetValue } from "react-hook-form";

import { cn } from "../../lib/utils";
import { Textfield } from "../Textfield";

import { ProgramData } from "./types";

type ProgramInfoProperties = {
  register: UseFormRegister<ProgramData>;
  classname?: string;
  setCalendarValue: UseFormSetValue<ProgramData>;
  data: ProgramData | null;
};

export default function ProgramInfo({
  register,
  classname,
  setCalendarValue,
  data,
}: ProgramInfoProperties) {
  return (
    <div
      className={cn("inline-flex w-full flex-col items-start justify-start gap-6 py-3", classname)}
    >
      <div className="relative h-14 w-full flex-col">
        <div className="text-left text-base font-normal text-neutral-400">Program Name</div>
        <Textfield register={register} name="name" placeholder="Entrepreneur" mode="filled" />
      </div>

      <div className="relative h-14 w-full flex-col">
        <div className="text-left text-base font-normal text-neutral-400">Program Abbreviation</div>
        <Textfield register={register} name="abbreviation" placeholder="ENTR" mode="filled" />
      </div>

      <div className="relative flex h-auto w-full flex-col gap-3">
        <div className="flex text-center text-base font-normal leading-normal text-neutral-400">
          Program Type
        </div>
        <div className="flex grid h-12 w-full grid-cols-2 items-start justify-start divide-x overflow-hidden rounded-lg border border-neutral-400 bg-white bg-opacity-0 sm:w-2/5">
          <div className="relative flex h-full w-full items-center" key={"regular"}>
            <input
              {...register("type")}
              className="peer absolute flex h-full w-full appearance-none"
              id={"regular"}
              type="radio"
              value={"regular"}
            />
            <div className="pointer-events-none absolute flex h-full w-full items-center justify-center text-neutral-800 peer-checked:bg-pia_dark_green peer-checked:text-white">
              <div className="text-center text-base font-normal leading-normal ">Regular</div>
            </div>
          </div>
          <div className="relative flex h-full w-full items-center items-center" key={"varying"}>
            <input
              {...register("type")}
              className="peer flex h-full w-full appearance-none"
              id={"varying"}
              type="radio"
              value={"varying"}
            />
            <div className="pointer-events-none absolute flex h-full w-full items-center justify-center text-neutral-800 peer-checked:bg-pia_dark_green peer-checked:text-white">
              <div className="text-center text-base font-normal leading-normal ">Varying</div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex w-full flex-wrap gap-3 sm:w-4/5 sm:flex-row sm:flex-nowrap sm:gap-6">
        <div className="flex w-full flex-col sm:w-1/2">
          <div className="text-base font-normal text-neutral-400">Start Date</div>
          <Textfield
            register={register}
            name="start"
            placeholder="00/00/0000"
            calendar={true}
            setCalendarValue={setCalendarValue}
            defaultValue={data?.start}
          />
        </div>
        <div className="flex w-full flex-col sm:w-1/2">
          <div className="text-base font-normal text-neutral-400">End Date</div>
          <Textfield
            register={register}
            name="end"
            placeholder="00/00/0000"
            calendar={true}
            setCalendarValue={setCalendarValue}
            defaultValue={data?.end}
          />
        </div>
      </div>
    </div>
  );
}
