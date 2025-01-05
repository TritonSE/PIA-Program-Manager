import { Day } from "./types";

import { CalendarResponse } from "@/api/calendar";

/**
 * This function generates the dates for the calendar.
 * 0 = Sunday, 1 = Monday, ..., 6 = Saturday
 * 0 = Jan, 1 = Fed, ..., 11 = Dec
 * @param month
 * @param year
 * @returns
 */
export const generateDates = (month: number, year: number, calendar?: CalendarResponse): Day[] => {
  const days: Day[] = [];
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);

  // get days before start of month
  const startDay = first.getDay();

  for (let i = 0; i < startDay; i++) {
    const date = new Date(year, month, i - startDay + 1);
    let hours = 0;
    if (calendar) {
      for (const c of calendar.calendar) {
        const calendarDate = new Date(c.date);
        if (
          calendarDate.getMonth() === date.getMonth() &&
          calendarDate.getDate() === date.getDate() &&
          calendarDate.getFullYear() === date.getFullYear()
        ) {
          hours = c.hours;
        }
      }
    }
    days.push({ month: date.getMonth(), year: date.getFullYear(), day: date.getDate(), hours });
  }

  // get current month days
  for (let day = 1; day <= last.getDate(); day++) {
    const date = new Date(year, month, day);
    let hours = 0;
    if (calendar) {
      for (const c of calendar.calendar) {
        const calendarDate = new Date(c.date);
        if (
          calendarDate.getMonth() === date.getMonth() &&
          calendarDate.getDate() === date.getDate() &&
          calendarDate.getFullYear() === date.getFullYear()
        ) {
          hours = c.hours;
        }
      }
    }
    days.push({ month: date.getMonth(), year: date.getFullYear(), day: date.getDate(), hours });
  }

  // get days after end of month
  const endDay = last.getDay();
  const endDate = last.getDate();
  for (let i = endDay + 1; i <= 6; i++) {
    const date = new Date(year, month, i - endDay + endDate);
    let hours = 0;
    if (calendar) {
      for (const c of calendar.calendar) {
        const calendarDate = new Date(c.date);
        if (
          calendarDate.getMonth() === date.getMonth() &&
          calendarDate.getDate() === date.getDate() &&
          calendarDate.getFullYear() === date.getFullYear()
        ) {
          hours = c.hours;
        }
      }
    }
    days.push({ month: date.getMonth(), year: date.getFullYear(), day: date.getDate(), hours });
  }

  return days;
};
