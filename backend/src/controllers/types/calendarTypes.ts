export type CalendarSlot = {
  date: Date;
  hours: number;
  session: string;
};

export type Calendar = {
  studentId: string;
  programId: string;
  calendar: CalendarSlot[];
};
