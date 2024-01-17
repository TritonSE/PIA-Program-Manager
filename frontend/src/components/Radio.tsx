import React, { Dispatch, SetStateAction } from "react";

type RadioProps = {
  options: string[];
  setState: Dispatch<SetStateAction<string>>;
};

export default function Radio({ options, setState }: RadioProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setState(e.target.value);
  }
  return (
    <div className="grid gap-3">
      {options.map((option, index) => {
        return (
          <div className="flex items-center" key={option + index}>
            <input
              className="w-5 h-5  accent-pia_dark_green"
              id={option + index}
              onChange={handleChange}
              type="radio"
              name="radio"
              value={option}
            />
            <label className="select-none pl-5 flex-1" htmlFor={option + index}>
              {option}
            </label>
          </div>
        );
      })}
    </div>
  );
}
