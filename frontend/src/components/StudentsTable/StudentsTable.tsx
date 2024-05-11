import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useContext, useEffect, useMemo, useState } from "react";

import { getAllStudents } from "../../api/students";
import LoadingSpinner from "../LoadingSpinner";
import StudentFormButton from "../StudentFormButton";
import { Table } from "../ui/table";

import { fuzzyFilter, programFilterFn, statusFilterFn } from "./FilterFns";
import TBody from "./TBody";
import THead from "./THead";
import { StudentMap, StudentTableRow } from "./types";
import { useColumnSchema } from "./useColumnSchema";

import { ProgramsContext } from "@/contexts/program";
import { UserContext } from "@/contexts/user";
import { useWindowSize } from "@/hooks/useWindowSize";
import { cn } from "@/lib/utils";

export default function StudentsTable() {
  const [allStudents, setAllStudents] = useState<StudentMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [studentTable, setStudentTable] = useState<StudentTableRow[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const { isTablet } = useWindowSize();

  const { allPrograms } = useContext(ProgramsContext);
  const { isAdmin } = useContext(UserContext);

  useEffect(() => {
    getAllStudents().then(
      (result) => {
        console.log(result);
        if (result.success) {
          // Convert student array to object with keys as ids and values as corresponding student
          const studentsObject = result.data.reduce((obj, student) => {
            obj[student._id] = student;
            return obj;
          }, {} as StudentMap);
          console.log(result.data);

          setAllStudents(studentsObject);
          setIsLoading(false);
        } else {
          console.log(result.error);
        }
      },
      (error) => {
        console.log(error);
      },
    );
  }, []);

  useEffect(() => {
    const studentsInformation: StudentTableRow[] = Object.values(allStudents).map((studentObj) => {
      return {
        id: studentObj._id,
        student: studentObj.student.firstName + " " + studentObj.student.lastName,
        emergencyContact: studentObj.emergency,
        programs: studentObj.programs,
      } as StudentTableRow;
    });
    setStudentTable(studentsInformation);
  }, [allStudents]);

  const columns = useColumnSchema({ allStudents, allPrograms, setAllStudents });
  const data = useMemo(() => studentTable, [studentTable]);
  // const data = useMemo(() => [], [allStudents]);  // uncomment this line and comment the line above to see empty table state

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    filterFns: {
      fuzzy: fuzzyFilter,
      programFilter: programFilterFn,
      statusFilter: statusFilterFn,
    },
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  return (
    <div className="w-full space-y-5 overflow-x-auto">
      <div className="flex w-full items-center justify-between">
        <h1
          className={cn(
            "font-[alternate-gothic] text-4xl font-medium leading-none text-neutral-800",
            isTablet && "text-2xl",
          )}
        >
          Students
        </h1>
        {isAdmin && <StudentFormButton type="add" setAllStudents={setAllStudents} />}
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Table
          className={cn(
            "h-fit w-[100%] min-w-[640px] max-w-[1480px] border-collapse rounded-lg bg-pia_primary_white font-['Poppins']",
            isTablet && "text-[12px]",
          )}
        >
          <THead table={table} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
          <TBody table={table} />
        </Table>
      )}
    </div>
  );
}
