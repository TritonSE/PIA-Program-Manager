export type Calendar = {
  studentId: string;
  programId: string;
  calendar: {
    date: Date;
    hours: number;
    session: string;
  }[];
};
