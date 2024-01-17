"use client";
import { Dispatch, RefObject, SetStateAction } from "react";

import { cn } from "../lib/utils";

import OtherCheckbox from "./OtherCheckbox";

type CheckboxProps = {
  options: string[];
  state: string[];
  setState: Dispatch<SetStateAction<string[]>>;
  className?: string;
  otherRef?: RefObject<HTMLInputElement>;
};

export function Checkbox({
  options,
  state: checkedItems,
  setState: setCheckedItems,
  className,
  otherRef,
}: CheckboxProps) {
  function handleCheck(item: string) {
    let currentItem = [...checkedItems];
    if (currentItem.includes(item)) {
      currentItem = currentItem.filter((i) => {
        return i !== item;
      });
      setCheckedItems(currentItem);
    } else {
      currentItem.push(item);
      setCheckedItems(currentItem);
    }
  }

  if (options.includes("Other") && !otherRef) {
    throw Error(
      "Please include otherRef as a prop to the Checkbox component or remove Other from the options list.",
    );
  }

  return (
    <form className={cn("grid gap-x-5 gap-y-3 sm:grid-cols-2 sm:min-w-2/5 min-w-4/5", className)}>
      {options.map((item, index) => {
        return item === "Other" && otherRef ? (
          <OtherCheckbox key={item + index} innerRef={otherRef} />
        ) : (
          <div className="flex justify-between content-center" key={item + index}>
            <label
              className="justify-left grid flex-1 content-center select-none py-[15px]"
              htmlFor={item + index}
            >
              {item}
            </label>
            <input
              id={item + index}
              className="checked:bg-pia_dark_green h-[40px] self-center  w-[40px] appearance-none rounded-[10px] bg-[#D9D9D9]"
              type="checkbox"
              onChange={() => {
                handleCheck(item);
              }}
              value={item}
            />
          </div>
        );
      })}
    </form>
  );
}
