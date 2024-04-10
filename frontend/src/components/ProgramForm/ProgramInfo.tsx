import { Path, UseFormRegister, UseFormSetValue } from "react-hook-form";

import { cn } from "../../lib/utils";
import { ColorRadio } from "../Radio";
import { Textfield } from "../Textfield";

import { SessionList } from "./ProgramSession";
import { ProgramData } from "./types";

type ProgramInfoProperties = {
  register: UseFormRegister<ProgramData>;
  classname?: string;
  setCalendarValue: UseFormSetValue<ProgramData>;
  data: ProgramData | null;
};

type CheckcircleProps = {
  options: string[];
  className?: string;
  name: Path<ProgramData>;
  register: UseFormRegister<ProgramData>;
  data: string[] | undefined;
};

type MoneyTextfieldProps = {
  className?: string;
  name: Path<ProgramData>;
  register: UseFormRegister<ProgramData>;
  label?: string;
  defaultValue: string | undefined;
};

export function MoneyTextfield({
  className,
  name,
  register,
  label,
  defaultValue,
}: MoneyTextfieldProps) {
  //Mostly copied from components/Textfield because idk where else this is going to show up
  return (
    <div
      className={cn(
        "relative flex flex-grow flex-row rounded-md border-[1px] border-pia_border px-2 py-3 focus-within:border-pia_dark_green ",
        className,
      )}
    >
      <div className="w-12 overflow-hidden whitespace-nowrap text-center text-lg font-bold text-black">
        <div>$</div>
      </div>
      <input
        {...register(name)}
        className="focus-visible:out w-full appearance-none bg-inherit px-2 placeholder-pia_accent outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        id={label}
        type="number"
        onChange={undefined}
        placeholder={"0.00"}
        defaultValue={defaultValue}
        max={99999.99}
        min={0.0}
      />
      <div className="w-24 overflow-hidden text-center text-lg font-bold text-black">
        <div>USD</div>
      </div>
    </div>
  );
}

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

export function ProgramInfo({
  register,
  classname,
  setCalendarValue,
  data,
}: ProgramInfoProperties) {
  return (
    <div
      className={cn(
        "inline-flex w-full flex-col items-start justify-start gap-3 py-3 text-sm sm:gap-6 sm:pr-24 sm:text-base",
        classname,
      )}
    >
      <div className="relative h-14 w-full flex-col">
        <div className="text-sm font-normal text-neutral-400 sm:text-base">Program Name</div>
        <Textfield
          className="text-sm sm:text-base"
          register={register}
          name="name"
          placeholder="Entrepreneur"
          mode="filled"
          defaultValue={data?.name}
        />
      </div>

      <div className="relative h-14 w-full flex-col">
        <div className="text-left text-sm font-normal text-neutral-400 sm:text-base">
          Program Abbreviation
        </div>
        <Textfield
          className="text-sm sm:text-base"
          register={register}
          name="abbreviation"
          placeholder="ENTR"
          mode="filled"
          defaultValue={data?.abbreviation}
        />
      </div>

      <div className="relative flex h-auto w-full flex-col gap-3">
        <div className="flex text-center text-sm font-normal leading-normal text-neutral-400 sm:text-base">
          Program Type
        </div>
        <div className="flex grid h-12 grid-cols-2 items-start justify-start divide-x overflow-hidden rounded-lg border border-neutral-400 bg-white bg-opacity-0 sm:w-3/5">
          <div className="relative flex h-full w-full items-center" key={"regular"}>
            <input
              {...register("type")}
              className="peer absolute flex h-full w-full appearance-none"
              id={"regular"}
              type="radio"
              value={"regular"}
              defaultChecked={data?.type === "regular"}
            />

            <div className="pointer-events-none absolute flex h-full w-full items-center justify-center text-neutral-800 peer-checked:bg-pia_dark_green peer-checked:text-white">
              <div className="text-center text-sm font-normal leading-normal sm:text-base ">
                Regular
              </div>
            </div>
          </div>
          <div className="relative flex h-full w-full items-center items-center" key={"varying"}>
            <input
              {...register("type")}
              className="peer absolute flex h-full w-full appearance-none"
              id={"varying"}
              type="radio"
              value={"varying"}
              defaultChecked={data?.type === "varying"}
            />

            <div className="pointer-events-none absolute flex h-full w-full items-center justify-center text-neutral-800 peer-checked:bg-pia_dark_green peer-checked:text-white">
              <div className="text-center text-sm font-normal leading-normal sm:text-base ">
                Varying
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex w-full flex-wrap flex-nowrap gap-3 gap-6 text-sm sm:flex-row sm:gap-6 sm:text-base">
        <div className="flex w-1/2 w-full flex-col gap-1 sm:gap-3">
          <div className="font-normal text-neutral-400">Start Date</div>
          <Textfield
            register={register}
            name="start"
            placeholder="00/00/0000"
            calendar={true}
            setCalendarValue={setCalendarValue}
            defaultValue={data?.start}
          />
        </div>
        <div className="flex w-1/2 w-full flex-col gap-1 sm:gap-3">
          <div className="font-normal text-neutral-400">End Date</div>
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

      <div className="flex w-1/2 flex-col gap-1 pr-3 sm:gap-3">
        <div className="font-normal text-neutral-400">Renewal Date</div>
        <Textfield
          register={register}
          name="renewal"
          placeholder="00/00/0000"
          calendar={true}
          setCalendarValue={setCalendarValue}
          defaultValue={data?.start}
        />
      </div>

      <div className="flex w-1/2 flex-col gap-1 pr-3 sm:gap-3">
        <div className="font-normal text-neutral-400">Hourly Rate</div>
        <div>
          <MoneyTextfield register={register} name="hourly" defaultValue={data?.start} />
        </div>
      </div>

      <div className="relative flex h-auto w-full flex-col gap-3">
        <div className="text-left text-sm font-normal text-neutral-400 sm:text-base">
          Days of the week
        </div>
        <Checkcircle
          register={register}
          name="days"
          options={["Su", "M", "Tu", "W", "Th", "F", "Sa"]}
          data={data?.days}
        />
      </div>

      <SessionList register={register} name="sessions" defaultValue={data?.sessions} />

      <div className="stretch flex w-full flex-col items-start gap-2">
        <div className="text-center text-base font-normal text-neutral-400">Color (Cover)</div>

        <ColorRadio
          options={["#FF7A5E", "#FFB800", "#B6BF0E", "#4FA197", "#5DADE2", "#7986CB", "#EE6CEE"]}
          name="color"
          register={register}
          defaultValue={data?.color}
        />
      </div>
    </div>
  );
}
