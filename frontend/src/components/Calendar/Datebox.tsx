import React from "react";

export type DateboxProps = {
  updateCalendarFunc: (newHours: number, session: string) => Promise<void>;
  session: string;
  day: number;
  hours: number;
  saturday?: boolean;
};

export function Datebox({ updateCalendarFunc, session, day, hours, saturday }: DateboxProps) {
  let boxClass = "border-r border-t p-4 flex flex-col items-center";
  if (saturday) {
    boxClass = "border-t p-4 flex flex-col items-center";
  }

  const updateCalendar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newHours = Number(event.target.value);
    if (isNaN(newHours)) {
      return;
    }
    await updateCalendarFunc(newHours, session);
  };

  return (
    <div className={boxClass}>
      <div className=""> {day} </div>
      {hours !== -1 && (
        <input
          type="text"
          defaultValue={hours}
          className="w-1/2 rounded-md border border-gray-400 text-center"
          onChange={updateCalendar}
        />
      )}
      {hours === -1 && (
        <input type="text" className="w-1/2 rounded-md border border-gray-400 text-center" />
      )}
    </div>
  );
}
