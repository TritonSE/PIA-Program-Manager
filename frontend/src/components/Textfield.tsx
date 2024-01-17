"use client";

import { RefObject, useEffect, useState } from "react";

import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { cn } from "../lib/utils";

type TextFieldProps = {
  innerRef: RefObject<HTMLInputElement>;
  label?: string;
  placeholder: string;
  calendar?: boolean;
  className?: string;
};

export function Textfield({
  innerRef: ref,
  label,
  placeholder,
  calendar = false,
  className,
}: TextFieldProps) {
  const [date, setDate] = useState<Date>();

  useEffect(() => {
    if (date && ref.current) {
      ref.current.value = date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }
  }, [date]);

  return (
    <Popover>
      <div
        className={cn(
          "border-pia_border focus-within:border-pia_dark_green relative flex rounded-md border-[1px] px-2 py-3",
          className,
        )}
      >
        <input
          className="appearance-none placeholder-pia_accent focus-visible:out px-2 outline-none w-full bg-inherit"
          ref={ref}
          id={label + placeholder}
          type="text"
          placeholder={placeholder}
          maxLength={calendar ? 10 : 64}
        />

        {label ? (
          <label
            className="text-pia_border-200 absolute left-[1em] top-[-1em] bg-[white] p-[3px] text-xs select-none"
            htmlFor={label + placeholder}
          >
            {label}
          </label>
        ) : (
          ""
        )}

        {calendar ? (
          <>
            <PopoverTrigger asChild>
              {/* Calendar Icon */}
              <button>
                <svg
                  className="hover:cursor-pointer"
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
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </>
        ) : (
          ""
        )}
      </div>
    </Popover>
  );
}
