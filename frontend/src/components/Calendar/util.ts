import { Day } from "./types";

/**
 * This function generates the dates for the calendar.
 * 0 = Sunday, 1 = Monday, ..., 6 = Saturday
 * 0 = Jan, 1 = Fed, ..., 11 = Dec
 * @param month
 * @param year
 * @returns
 */
export const generateDates = (month: number, year: number): Day[] => {
  const days: Day[] = [];
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);

  // get days before start of month
  const startDay = first.getDay();

  for (let i = 0; i < startDay; i++) {
    const date = new Date(year, month, i - startDay + 1);
    days.push({ month: date.getMonth(), year: date.getFullYear(), day: date.getDate() });
  }

  // get current month days
  for (let day = 1; day <= last.getDate(); day++) {
    const date = new Date(year, month, day).getDate();
    days.push({ month, year, day: date });
  }

  // get days after end of month
  const endDay = last.getDay();
  const endDate = last.getDate();
  for (let i = endDay + 1; i <= 6; i++) {
    const date = new Date(year, month, i - endDay + endDate);
    days.push({ month: date.getMonth(), year: date.getFullYear(), day: date.getDate() });
  }

  return days;
};
