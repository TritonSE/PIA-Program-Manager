import { FieldValues, UseFormRegister } from "react-hook-form";

import { cn } from "../lib/utils";

type RadioProps = {
  options: string[];
  className?: string;
  name: string;
  register: UseFormRegister<FieldValues>;
};

export default function Radio({ options, register, name, className }: RadioProps) {
  return (
    <div className={cn("grid gap-3", className)}>
      {options.map((option, index) => {
        return (
          <div className="flex items-center" key={option + index}>
            <input
              {...register(name)}
              className="w-5 h-5  accent-pia_dark_green hover:cursor-pointer"
              id={option + index}
              type="radio"
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
