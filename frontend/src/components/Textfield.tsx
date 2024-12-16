import { useEffect, useState } from "react";
import {
  FieldValues,
  Path,
  PathValue,
  RegisterOptions,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";

import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { cn } from "../lib/utils";

type BaseProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  name: Path<T>;
  placeholder: string;
  label?: string;
  type?: string;
  disabled?: boolean;
  handleInputChange?: React.ChangeEventHandler<HTMLInputElement>;
  defaultValue?: string;
  className?: string;
  unitsClassName?: string;
  units?: string;
  icon?: React.ReactNode;
  mode?: "filled" | "outlined";
  registerOptions?: RegisterOptions;
};

type WithCalendarProps<T extends FieldValues> = BaseProps<T> & {
  calendar?: true; // When calendar is false or not provided, setCalendarValue is optional
  setCalendarValue?: UseFormSetValue<T>;
};

type WithoutCalendarProps<T extends FieldValues> = BaseProps<T> & {
  calendar?: false; // When calendar is false or not provided, setCalendarValue is optional
  setCalendarValue?: UseFormSetValue<T>;
};

type TextFieldProps<T extends FieldValues> = WithCalendarProps<T> | WithoutCalendarProps<T>;

export function Textfield<T extends FieldValues>({
  register,
  setCalendarValue,
  label,
  name, //Must be a key in form data type specified in useForm hook
  placeholder,
  calendar = false,
  handleInputChange,
  className,
  icon,
  type = "text",
  disabled = false,
  defaultValue = "",
  units = "",
  mode = "outlined",
  unitsClassName = "",
  registerOptions = {},
}: TextFieldProps<T>) {
  const [date, setDate] = useState<Date>();

  useEffect(() => {
    if (date && setCalendarValue) {
      const parsedDate = date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      setCalendarValue(name, parsedDate as PathValue<T, Path<T>>);
    }
  }, [date]);

  return mode === "outlined" ? (
    <Popover>
      <div
        className={cn(
          "relative flex flex-grow rounded-md border-[1px] border-pia_border bg-white px-2 py-3 focus-within:border-pia_dark_green ",
          className,
        )}
      >
        {icon ? <span className={"grid place-items-center pl-1"}>{icon}</span> : null}
        <input
          {...register(name as Path<T>, registerOptions)}
          className="focus-visible:out w-full appearance-none  px-2 placeholder-pia_accent outline-none"
          id={name + label + placeholder}
          type={type}
          disabled={disabled}
          onChange={handleInputChange ?? register(name as Path<T>, registerOptions).onChange}
          placeholder={placeholder}
          defaultValue={defaultValue}
        />

        {units !== "" && <h1 className={cn("ml-[-20px]", unitsClassName)}>{units}</h1>}

        {label ? (
          <label
            className="absolute left-[1em] top-[-1em] z-[0] select-none bg-pia_primary_light_green p-[3px] text-xs text-pia_border-200"
            htmlFor={label + placeholder}
          >
            <span className="absolute bottom-[0] left-[0] z-[-1] h-[50%] w-full bg-white"></span>
            {label}
          </label>
        ) : (
          ""
        )}

        {calendar ? (
          <>
            <PopoverTrigger asChild>
              <button>
                {/* Calendar Icon */}
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
  ) : (
    <div
      className={cn(
        "relative flex flex-grow flex-col border-b-2 border-pia_accent py-1 focus-within:border-pia_dark_green",
        className,
      )}
    >
      <input
        {...register(name as Path<T>, registerOptions)}
        className="focus-visible:out w-full appearance-none bg-inherit placeholder-pia_accent outline-none placeholder:italic"
        id={label + placeholder}
        type={type}
        onChange={handleInputChange ?? register(name as Path<T>, registerOptions).onChange}
        placeholder={placeholder}
        defaultValue={defaultValue}
      />
      {units !== "" && <h1 className={cn(unitsClassName, "ml-[-20px]")}>{units}</h1>}
    </div>
  );
}
