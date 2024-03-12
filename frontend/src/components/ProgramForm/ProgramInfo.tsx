import { UseFormRegister, UseFormSetValue } from "react-hook-form";

import { cn } from "../../lib/utils";
import { Button } from "../Button";
import { Textfield } from "../Textfield";

import { ProgramData } from "./types";

type ProgramInfoProperties = {
  register: UseFormRegister<ProgramData>;
  classname?: string;
  setCalendarValue: UseFormSetValue<ProgramData>;
  data: ProgramData | null;
  isMobile?: boolean;
};

export default function ProgramInfo({
  register,
  classname,
  setCalendarValue,
  data,
  isMobile,
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
        <div className="flex h-12 w-full flex-row items-start justify-start sm:w-2/5">
          <div className="flex h-12 w-1/2 items-center justify-center rounded-bl rounded-tl border border-neutral-400 bg-white bg-opacity-0 px-6 py-3">
            <div className="text-center text-base font-normal leading-normal text-neutral-800">
              Regular
            </div>
          </div>
          <div className="flex h-12 w-1/2 items-center justify-center rounded-br rounded-tr border-b border-r border-t border-neutral-400 bg-white bg-opacity-0 px-6 py-3">
            <div className="text-center text-base font-normal leading-normal text-neutral-800">
              Varying
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex w-full flex-wrap gap-3 sm:w-4/5 sm:flex-row sm:flex-nowrap sm:gap-6">
        <div className="flex w-full flex-col sm:w-1/2">
          <div className="text-base font-normal text-neutral-400">Start Date</div>
          <div className="inline-flex h-10 w-full items-center justify-start gap-2.5 rounded border border-neutral-400 bg-zinc-100 px-4 py-2 sm:max-w-[230px]">
            {/* Calendar Icon */}
            <svg
              className=""
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.3636 3.81818H18.4545V2H16.6364V3.81818H7.54545V2H5.72727V3.81818H4.81818C3.81818 3.81818 3 4.63636 3 5.63636V20.1818C3 21.1818 3.81818 22 4.81818 22H19.3636C20.3636 22 21.1818 21.1818 21.1818 20.1818V5.63636C21.1818 4.63636 20.3636 3.81818 19.3636 3.81818ZM19.3636 20.1818H4.81818V10.1818H19.3636V20.1818ZM19.3636 8.36364H4.81818V5.63636H19.3636V8.36364Z"
                fill="#5E6368"
              />
            </svg>
            <div className="text-neutral-800">Select Date</div>
          </div>
        </div>
        <div className="flex w-full flex-col sm:w-1/2">
          <div className="text-base font-normal text-neutral-400">End Date</div>
          <div className="inline-flex h-10 w-full items-center justify-start gap-2.5 rounded border border-neutral-400 bg-zinc-100 px-4 py-2 sm:max-w-[230px] ">
            {/* Calendar Icon */}
            <svg
              className=""
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.3636 3.81818H18.4545V2H16.6364V3.81818H7.54545V2H5.72727V3.81818H4.81818C3.81818 3.81818 3 4.63636 3 5.63636V20.1818C3 21.1818 3.81818 22 4.81818 22H19.3636C20.3636 22 21.1818 21.1818 21.1818 20.1818V5.63636C21.1818 4.63636 20.3636 3.81818 19.3636 3.81818ZM19.3636 20.1818H4.81818V10.1818H19.3636V20.1818ZM19.3636 8.36364H4.81818V5.63636H19.3636V8.36364Z"
                fill="#5E6368"
              />
            </svg>
            <div className="text-neutral-800">Select Date</div>
          </div>
        </div>
      </div>
    </div>
  );
}
