"use client";
import { Dispatch, SetStateAction } from "react";

type CheckboxProps = {
  options: string[];
  state: string[];
  setState: Dispatch<SetStateAction<string[]>>;
};

export function Checkbox({
  options,
  state: checkedItems,
  setState: setCheckedItems,
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

  return (
    <form className="grid gap-x-5 gap-y-3 sm:grid-cols-2 sm:min-w-2/5 min-w-4/5">
      {options.map((item, index) => (
        <div className="flex justify-between" key={item + index}>
          <label
            className="justify-left grid flex-1 content-center select-none"
            htmlFor={item + index}
          >
            {item}
          </label>
          <input
            id={item + index}
            className="checked:bg-pia_dark_green h-[40px] w-[40px] appearance-none rounded-[10px] bg-[#D9D9D9]"
            type="checkbox"
            onChange={() => {
              handleCheck(item);
            }}
            value={item}
          />
        </div>
      ))}
    </form>
  );
}
