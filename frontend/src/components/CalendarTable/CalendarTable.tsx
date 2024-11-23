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
import { StudentMap } from "../StudentsTable/types";
import { Table } from "../ui/table";

import Filter, { fuzzyFilter, programFilterFn, statusFilterFn } from "./Filters";

// import Filter from "./Filters";
import TBody from "./TBody";
import THead from "./THead";
import { CalendarTableRow } from "./types";
import { useColumnSchema } from "./useColumnSchema";

import { ProgramsContext } from "@/contexts/program";
// import { UserContext } from "@/contexts/user";
import { useWindowSize } from "@/hooks/useWindowSize";
import { cn } from "@/lib/utils";

export default function CalendarTable() {
  const [allStudents, setAllStudents] = useState<StudentMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [calendarTable, setCalendarTable] = useState<CalendarTableRow[]>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const { isTablet } = useWindowSize();

  const { allPrograms } = useContext(ProgramsContext);
  // const { isAdmin } = useContext(UserContext);

  // get all students and store them in allStudents
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

  // Take all students and put them in rows for table
  useEffect(() => {
    const tableRows: CalendarTableRow[] = Object.values(allStudents).flatMap((student) => {
      // Generate a row for each program the student is enrolled in
      return student.programs.map(
        (program) =>
          ({
            id: student._id,
            profilePicture: "default",
            student: `${student.student.firstName} ${student.student.lastName}`,
            programs: { ...program, studentId: student._id },
          }) as CalendarTableRow,
      );
    });

    setCalendarTable(tableRows);
  }, [allStudents]);

  const columns = useColumnSchema({ allPrograms });
  const data = useMemo(() => calendarTable, [calendarTable]);

  // have to make different filter functions
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
    debugColumns: true,
  });

  return (
    <div className="w-full space-y-5 overflow-x-auto">
      <div className="flex w-full flex-col items-start justify-between space-y-10">
        <h1
          className={cn(
            "font-[alternate-gothic] text-4xl font-medium leading-none text-neutral-800",
            isTablet && "text-2xl",
          )}
        >
          Calendar
        </h1>

        <p>Choose a Student to View Attendance</p>

        <Filter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} table={table} />
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
          <THead table={table} />
          <TBody table={table} />
        </Table>
      )}
    </div>
  );
}
