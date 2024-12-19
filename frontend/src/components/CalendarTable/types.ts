import { ColumnDef } from "@tanstack/react-table";

import { ProgramLink } from "../StudentForm/types";

export type EnrollmentLink = {
  studentId: string;
} & ProgramLink;

export type CalendarTableRow = {
  id: string;
  profilePicture: string;
  student: string;
  programs: EnrollmentLink;
};

export type Columns = ColumnDef<CalendarTableRow, EnrollmentLink | string>[];
