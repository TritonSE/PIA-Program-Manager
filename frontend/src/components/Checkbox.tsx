"use client";
import { FieldValues, UseFormRegister } from "react-hook-form";

import { cn } from "../lib/utils";

import OtherCheckbox from "./OtherCheckbox";

type CheckboxProps = {
  options: string[];
  className?: string;
  name: string;
  register: UseFormRegister<FieldValues>;
};

export function Checkbox({ options, className, name, register }: CheckboxProps) {
  return (
    <div className={cn("sm:min-w-2/5 min-w-4/5 grid gap-x-5 gap-y-3 sm:grid-cols-2", className)}>
      {options.map((item, index) => {
        return item === "Other" ? (
          <OtherCheckbox register={register} key={item + index} />
        ) : (
          <div className="flex content-center justify-between " key={item + index}>
            <label
              className="justify-left grid flex-1 select-none content-center py-[15px] hover:cursor-pointer"
              htmlFor={item + index}
            >
              {item}
            </label>
            <input
              {...register(name)}
              id={item + index}
              className="h-[40px] w-[40px] appearance-none  self-center rounded-[10px] bg-[#D9D9D9] checked:bg-pia_dark_green hover:cursor-pointer"
              type="checkbox"
              name={name}
              value={item}
            />
          </div>
        );
      })}
    </div>
  );
}
