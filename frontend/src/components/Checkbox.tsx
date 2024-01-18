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
    <div className={cn("grid gap-x-5 gap-y-3 sm:grid-cols-2 sm:min-w-2/5 min-w-4/5", className)}>
      {options.map((item, index) => {
        return item === "Other" ? (
          <OtherCheckbox register={register} key={item + index} />
        ) : (
          <div className="flex justify-between content-center " key={item + index}>
            <label
              className="justify-left grid flex-1 content-center select-none py-[15px] hover:cursor-pointer"
              htmlFor={item + index}
            >
              {item}
            </label>
            <input
              {...register(name)}
              id={item + index}
              className="checked:bg-pia_dark_green h-[40px] self-center  w-[40px] appearance-none rounded-[10px] bg-[#D9D9D9] hover:cursor-pointer"
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
