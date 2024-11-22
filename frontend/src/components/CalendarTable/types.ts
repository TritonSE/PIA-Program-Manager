import { ColumnDef } from "@tanstack/react-table";

import { ProgramLink } from "../StudentForm/types";

export type CalendarTableRow = {
  id: string;
  profilePicture: string;
  student: string;
  programs: ProgramLink;
};

export type Columns = ColumnDef<CalendarTableRow, ProgramLink | string>[];
