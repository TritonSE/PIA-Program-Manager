export type ProgramData = {
  name: string;
  abbreviation: string;
  type: string;
  daysOfWeek: string[];
  color: string; //colorValueHex;
  hourlyPay: string;
  sessions: [string[]];
};

export type CreateProgramRequest = {
  name: string;
  abbreviation: string;
  type: string;
  daysOfWeek: string[];
  color: string;
  hourlyPay: string;
  sessions: { start_time: string; end_time: string }[];
};
