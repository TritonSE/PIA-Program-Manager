export const timeToAmPm = (time: string) => {
  if (!time) return "";
  const [hour, minute] = time.split(":");
  const hourNum = parseInt(hour);
  const minuteNum = parseInt(minute);
  if (hourNum > 12) {
    return `${hourNum - 12}:${minuteNum.toString().padStart(2, "0")} PM`;
  } else {
    return `${hourNum}:${minuteNum.toString().padStart(2, "0")} AM`;
  }
};

// provide the reverse function of timeToAmPm - convert XX:YY AM - AA:BB PM to [XX:YY, AA:BB]
export const amPmToTime = (times: string[]) => {
  if (!times.every((time) => time.includes("AM") || time.includes("PM"))) return [];
  return times.map((time) => {
    const [t1, t2] = time.split("-");
    const [hour1, minute1] = t1.split(":");
    const [hour2, minute2] = t2.split(":");
    const hour1Num = parseInt(hour1);
    const minute1Num = parseInt(minute1);
    const hour2Num = parseInt(hour2);
    const minute2Num = parseInt(minute2);
    return [
      `${hour1Num > 12 ? hour1Num + 12 : hour1Num}:${minute1Num.toString().padStart(2, "0")}`,
      `${hour2Num > 12 ? hour2Num + 12 : hour2Num}:${minute2Num.toString().padStart(2, "0")}`,
    ];
  });
};
