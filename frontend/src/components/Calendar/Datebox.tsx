import React from "react";

export type DateboxProps = {
  day: number;
  hours: number;
  saturday?: boolean;
};

export function Datebox({ day, hours, saturday }: DateboxProps) {
  let boxClass = "border-r border-t p-2 flex flex-col items-center";
  if (saturday) {
    boxClass = "border-t p-2 flex flex-col items-center";
  }

  return (
    <div className={boxClass}>
      <div className=""> {day} </div>
      {hours !== 0 && (
        <input
          type="text"
          defaultValue={hours}
          className="w-1/2 rounded-md border border-gray-400 text-center"
        />
      )}
      {hours === 0 && (
        <input type="text" className="w-1/2 rounded-md border border-gray-400 text-center" />
      )}
    </div>
  );
}
