import React, { Dispatch, SetStateAction } from "react";

import { cn } from "../lib/utils";

type RadioProps = {
  options: string[];
  setState: Dispatch<SetStateAction<string>>;
  className?: string;
};

export default function Radio({ options, setState, className }: RadioProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setState(e.target.value);
  }
  return (
    <div className={cn("grid gap-3", className)}>
      {options.map((option, index) => {
        return (
          <div className="flex items-center" key={option + index}>
            <input
              className="w-5 h-5  accent-pia_dark_green hover:cursor-pointer"
              id={option + index}
              onChange={handleChange}
              type="radio"
              name="radio"
              value={option}
            />
            <label
              className="select-none pl-5 flex-1 hover:cursor-pointer"
              htmlFor={option + index}
            >
              {option}
            </label>
          </div>
        );
      })}
    </div>
  );
}
