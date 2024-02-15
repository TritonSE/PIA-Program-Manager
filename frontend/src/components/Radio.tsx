import { FieldValues, Path, UseFormRegister } from "react-hook-form";

import { cn } from "../lib/utils";

type RadioProps<T extends FieldValues> = {
  options: string[];
  className?: string;
  name: Path<T>;
  register: UseFormRegister<T>;
};

export default function Radio<T extends FieldValues>({
  options,
  register,
  name,
  className,
}: RadioProps<T>) {
  return (
    <div className={cn("grid gap-3", className)}>
      {options.map((option, index) => {
        return (
          <div className="flex items-center" key={option + index}>
            <input
              {...register(name)}
              className="h-5 w-5  accent-pia_dark_green hover:cursor-pointer"
              id={option + index}
              type="radio"
              value={option}
            />
            <label
              className="flex-1 select-none pl-5 hover:cursor-pointer"
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
