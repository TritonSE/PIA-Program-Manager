import { FieldValues, Path, UseFormRegister } from "react-hook-form";

import { cn } from "../lib/utils";

import OtherCheckbox from "./OtherCheckbox";

type CheckboxProps<T extends FieldValues> = {
  options: string[];
  className?: string;
  name: Path<T>;
  defaultValue?: string[];
  defaultOtherValue?: string;
  register: UseFormRegister<T>;
};

export function Checkbox<T extends FieldValues>({
  options,
  className,
  name,
  register,
  defaultValue,
  defaultOtherValue,
}: CheckboxProps<T>) {
  defaultValue = defaultValue?.map((item) => item.toLowerCase());

  return (
    <div className={cn("min-w-4/5 grid w-full gap-x-5 gap-y-5", className)}>
      {options.map((item, index) => {
        return item === "Other" ? (
          <OtherCheckbox
            register={register}
            key={item + index}
            defaultOtherValue={defaultOtherValue}
          />
        ) : (
          <div className="flex content-center items-center justify-between" key={item + index}>
            <label
              className="justify-left grid flex-1 select-none content-center py-[15px] hover:cursor-pointer"
              htmlFor={item + index}
            >
              {item}
            </label>
            <div className="relative flex ">
              <input
                {...register(name)}
                id={item + index}
                className="peer h-[40px] w-[40px]  appearance-none rounded-[5px] bg-[#D9D9D9] transition-colors hover:cursor-pointer hover:bg-[#00686766] focus-visible:bg-[#00686766]"
                type="checkbox"
                name={name}
                value={item}
                defaultChecked={defaultValue?.includes(item.toLowerCase())}
              />
              <svg
                className="pointer-events-none absolute inset-0 hidden h-[40px] w-[40px] peer-checked:block peer-checked:bg-white"
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.44444 0C3.2657 0 2.13524 0.468252 1.30175 1.30175C0.468252 2.13524 0 3.2657 0 4.44444V35.5556C0 36.7343 0.468252 37.8648 1.30175 38.6983C2.13524 39.5317 3.2657 40 4.44444 40H35.5556C36.7343 40 37.8648 39.5317 38.6983 38.6983C39.5317 37.8648 40 36.7343 40 35.5556V4.44444C40 3.2657 39.5317 2.13524 38.6983 1.30175C37.8648 0.468252 36.7343 0 35.5556 0H4.44444ZM31 15.1022C31.417 14.6855 31.6514 14.1203 31.6516 13.5308C31.6518 12.9413 31.4178 12.3759 31.0011 11.9589C30.5844 11.5419 30.0192 11.3075 29.4297 11.3073C28.8402 11.3071 28.2748 11.5411 27.8578 11.9578L16.8578 22.9578L12.1444 18.2444C11.9381 18.038 11.6932 17.8742 11.4235 17.7624C11.1539 17.6506 10.8649 17.593 10.573 17.5929C9.98352 17.5927 9.41809 17.8267 9.00111 18.2433C8.58413 18.66 8.34976 19.2253 8.34955 19.8148C8.34934 20.4043 8.58332 20.9697 9 21.3867L15.1289 27.5156C15.3559 27.7427 15.6254 27.9228 15.9221 28.0457C16.2187 28.1687 16.5367 28.2319 16.8578 28.2319C17.1789 28.2319 17.4968 28.1687 17.7935 28.0457C18.0901 27.9228 18.3597 27.7427 18.5867 27.5156L31 15.1022Z"
                  fill="#006867"
                />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}
