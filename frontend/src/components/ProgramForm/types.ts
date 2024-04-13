export type ProgramData = {
  name: string;
  abbreviation: string;
  type: string;
  days: string[];
  startDate: Date;
  endDate: Date;
  color: string;
  renewalDate: Date;
  hourly: string;
  sessions: string[][];
};

export type CreateProgramRequest = {
  name: string;
  abbreviation: string;
  type: string;
  daysOfWeek: string[];
  startDate: Date;
  endDate: Date;
  color: string;
  renewalDate: Date;
  hourly: string;
  sessions: string[][];
  students?: string[];
};
