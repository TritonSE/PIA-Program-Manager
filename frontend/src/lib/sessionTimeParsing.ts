import { format, parse } from "date-fns";
export const timeToAmPm = (time: string): string => {
  if (!time) return "";
  const parsedTime = parse(time, "HH:mm", new Date());
  return format(parsedTime, "hh:mm a");
};

// provide the reverse function of timeToAmPm - convert XX:YY AM - AA:BB PM to [XX:YY, AA:BB]
export const amPmToTime = (time: string): { start_time: string; end_time: string } => {
  if (!time.includes("-")) return { start_time: "", end_time: "" };
  const [start, end] = time.split("-");
  const startTime = parse(start.trim(), "hh:mm a", new Date());
  const endTime = parse(end.trim(), "hh:mm a", new Date());
  return { start_time: format(startTime, "HH:mm"), end_time: format(endTime, "HH:mm") };
};
