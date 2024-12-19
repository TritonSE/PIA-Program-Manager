import { ColumnDef } from "@tanstack/react-table";

import { Student } from "../../api/students";
import { Contact, Enrollment } from "../StudentForm/types";

import { Program } from "@/api/programs";

export type StudentTableRow = {
  id: string;
  student: string;
  emergencyContact: Contact;
  enrollments: Enrollment[];
};

export type Columns = ColumnDef<StudentTableRow, Enrollment | Contact | string>[];
export type StudentMap = Record<string, Student>;
export type ProgramMap = Record<string, Program>;
