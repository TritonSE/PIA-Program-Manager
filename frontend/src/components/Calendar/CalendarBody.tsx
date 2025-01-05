import { Poppins } from "next/font/google";
import React, { useEffect, useState } from "react";

import { Datebox } from "./Datebox";
import { Day, Months, Weekdays } from "./types";
import { generateDates } from "./util";

import { CalendarResponse } from "@/api/calendar";

const poppins = Poppins({ weight: ["400", "700"], style: "normal", subsets: [] });

export type CalendarBodyProps = {
  calendar?: CalendarResponse;
};

//
export const CalendarBody: React.FC<CalendarBodyProps> = ({ calendar }: CalendarBodyProps) => {
  const today = new Date();

  const [month, changeMonth] = useState<number>(today.getMonth());
  const [year, changeYear] = useState<number>(today.getFullYear());
  const [calendarHeader, changeCalendarHeader] = useState<string>(Months[month] + " " + year);
  const [dates, changeDates] = useState<Day[]>(generateDates(month, year, calendar));

  useEffect(() => {
    changeCalendarHeader(Months[month] + " " + year);
    changeDates(generateDates(month, year, calendar));
  }, [month, year]);

  const decrementMonth = () => {
    if (month === 0) {
      changeMonth(11);
      changeYear(year - 1);
    } else {
      changeMonth(month - 1);
    }
  };

  const incrementMonth = () => {
    if (month === 11) {
      changeMonth(0);
      changeYear(year + 1);
    } else {
      changeMonth(month + 1);
    }
  };

  const bodyClass = `mx-auto w-full border rounded-lg shadow ${poppins.className}`;

  return (
    <div className={bodyClass}>
      <div className="gap-4 rounded-t-lg bg-teal-700 p-6 text-white">
        {/* <!-- https://waymondrang.com --> */}
        <div
          className="flex"
          style={{
            justifyContent: "space-between",
            width: "220px",
          }}
        >
          <h2 className="text-xl font-bold">{calendarHeader}</h2>
          <div
            className="flex"
            style={{
              justifyContent: "space-between",
              width: "36px",
            }}
          >
            <button className="text-xl" onClick={decrementMonth}>
              &#60;
            </button>
            <button className="text-xl" onClick={incrementMonth}>
              &#62;
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-7 bg-white text-center font-medium">
        {Weekdays.slice(0, Weekdays.length - 1).map((day, i) => (
          <div key={i} className="border-r p-2 text-gray-600">
            {" "}
            {day}{" "}
          </div>
        ))}
        <div className="p-2 text-gray-600"> {Weekdays[Weekdays.length - 1]} </div>
      </div>
      <div className="grid grid-cols-7  bg-white">
        {dates.slice(0, dates.length).map((date, i) => (
          <Datebox key={i} day={date.day} hours={date.hours} />
        ))}
      </div>
    </div>
  );
};
