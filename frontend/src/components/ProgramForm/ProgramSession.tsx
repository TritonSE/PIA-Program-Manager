import { useState } from "react";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";

import { cn } from "../../lib/utils";
import { Textfield } from "../Textfield";

type SessionListProps<T extends FieldValues> = {
  className?: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  defaultValue?: { start_time: string; end_time: string }[];
};

export function SessionList<T extends FieldValues>({
  register,
  name,
  className,
  defaultValue,
}: SessionListProps<T>) {
  const [sessions, setSessions] = useState(
    defaultValue ? defaultValue : [{ start_time: "", end_time: "" }],
  );

  return (
    <div>
      <div className={cn("flex h-auto flex-col gap-3 text-neutral-400 sm:gap-6", className)}>
        {sessions.map((item, index) => {
          const sessionName = name + "." + index;
          return (
            <div
              key={item.start_time + index}
              className="relative flex w-full flex-wrap gap-3 ease-in animate-in fade-in-0 sm:flex-row sm:flex-nowrap sm:gap-6"
            >
              <div className="flex w-1/2 w-full flex-col gap-1 sm:gap-3">
                <div className="text-base font-normal">Session {index + 1}</div>
                <div className="flex flex-row items-center gap-3 text-center text-center text-neutral-800">
                  <Textfield
                    register={register}
                    name={(sessionName + ".0") as Path<T>}
                    placeholder="hh:mm"
                    defaultValue={sessions[index].start_time}
                  />
                  to
                  <Textfield
                    register={register}
                    name={(sessionName + ".1") as Path<T>}
                    placeholder="hh:mm"
                    defaultValue={sessions[index].end_time}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <button
        className="mb-3 mt-3 text-neutral-400 underline-offset-2 hover:underline sm:mb-0 sm:mt-6"
        type="button"
        onClick={() => {
          setSessions([...sessions, { start_time: "", end_time: "" }]);
        }}
      >
        + Add Session
      </button>
    </div>
  );
}
