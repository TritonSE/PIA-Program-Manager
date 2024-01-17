"use client";
import React, { useState } from "react";

import { Calendar } from "../components/ui/calendar";

export default function CalendarButton() {
  const [openCalendar, setOpenCalendar] = useState(false);
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="grid">
      <button
        onClick={() => {
          setOpenCalendar(!openCalendar);
        }}
      >
        <svg
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
      {openCalendar ? (
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border absolute bottom-[100%] mb-3 left-0"
        />
      ) : (
        ""
      )}
    </div>
  );
}
