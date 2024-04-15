import { ColumnDef } from "@tanstack/react-table";

import { Student } from "../../api/students";
import { Contact, ProgramLink } from "../StudentForm/types";

import { Program } from "@/api/programs";

export type StudentTableRow = {
  id: string;
  student: string;
  emergencyContact: Contact;
  programs: ProgramLink[];
};

export type Columns = ColumnDef<StudentTableRow, ProgramLink | Contact | string>[];
export type StudentMap = Record<string, Student>;
export type ProgramMap = Record<string, Program>;
