import { ColumnDef } from "@tanstack/react-table";

import { Student } from "../../api/students";
import { Contact } from "../StudentForm/types";

export type Columns = ColumnDef<Student, string | Contact>[];
export type StudentMap = Record<string, Student>;
