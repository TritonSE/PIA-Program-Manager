export type ProgramData = {
  name: string;
  abbreviation: string;
  type: string;
  daysOfWeek: string[];
  color: string; //colorValueHex;
  hourlyPay: string;
  sessions: [string[]];
  archived: boolean;
};

export type CreateProgramRequest = {
  name: string;
  abbreviation: string;
  type: string;
  daysOfWeek: string[];
  color: string;
  hourlyPay: string;
  sessions: string[][];
  archived: boolean;
};
