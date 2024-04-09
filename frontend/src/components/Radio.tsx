import { FieldValues, Path, UseFormRegister } from "react-hook-form";

import { cn } from "../lib/utils";

import { programColor } from "./ProgramForm/types";

type RadioProps<T extends FieldValues> = {
  options: string[];
  className?: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  defaultValue?: programColor | undefined;
};

type ColorRadioProps<T extends FieldValues> = RadioProps<T> & {
  options: programColor[];
};

const programColors = {
  teal: "bg-secondary_teal",
  green: "bg-secondary_green",
  red: "bg-secondary_red",
  yellow: "bg-secondary_yellow",
  blue: "bg-secondary_blue",
  violet: "bg-secondary_violet",
  fuchsia: "bg-secondary_fuchsia",
};

export function Radio<T extends FieldValues>({
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
              className="h-5 w-5 accent-pia_dark_green hover:cursor-pointer"
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
export function ColorRadio<T extends FieldValues>({
  options,
  register,
  name,
  className,
  defaultValue,
}: ColorRadioProps<T>) {
  return (
    <div className={cn("flex flex-row gap-2 sm:gap-3", className)}>
      {options.map((option, index) => {
        return (
          <div className="relative flex items-center" key={option + index}>
            <input
              {...register(name)}
              className={cn(
                "peer flex h-10 w-10 appearance-none rounded-full border-[1px] border-pia_border transition-colors hover:cursor-pointer focus-visible:bg-[#00686766] sm:h-12 sm:w-12 sm:border-[2px]",
                programColors[option as programColor],
              )}
              id={option + index}
              type="radio"
              value={option}
              defaultChecked={option === defaultValue}
            />

            <svg
              className="invisible absolute inset-2 peer-checked:visible sm:inset-3"
              width="25"
              height="25"
              viewBox="0 0 13 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.1898 0.682459C11.4757 0.345561 11.9805 0.304181 12.3174 0.590034C12.6284 0.853897 12.6876 1.30435 12.47 1.63707L12.4099 1.71762L4.94319 10.5176C4.66341 10.8474 4.17804 10.8913 3.8449 10.6339L3.77088 10.5691L0.837551 7.67053C0.523275 7.35998 0.520254 6.85346 0.830805 6.53918C1.11747 6.24908 1.57111 6.22419 1.88639 6.46633L1.96216 6.53243L4.28145 8.82404L11.1898 0.682459Z"
                fill="white"
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
}
