import {
  ColumnFiltersState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useEffect, useMemo, useState } from "react";

import { getAllStudents } from "../../api/students";
import { fuzzyFilter } from "../../lib/fuzzyFilter";
import StudentFormButton from "../StudentFormButton";
import { Table } from "../ui/table";

import TBody from "./TBody";
import THead from "./THead";
import { StudentMap } from "./types";
import { useColumnSchema } from "./useColumnSchema";

import { Program, getAllPrograms } from "@/api/programs";
import { useWindowSize } from "@/hooks/useWindowSize";
import { cn } from "@/lib/utils";

export default function StudentsTable() {
  const [allStudents, setAllStudents] = useState<StudentMap>({});
  const [allPrograms, setAllPrograms] = useState<Record<string, Program>>({}); // map from program id to program
  const [isLoading, setIsLoading] = useState(true);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const { isTablet } = useWindowSize();

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
    getAllPrograms().then((result) => {
      if (result.success) {
        const programsObject = result.data.reduce(
          (obj, program) => {
            obj[program._id] = program;
            return obj;
          },
          {} as Record<string, Program>,
        );
        setAllPrograms(programsObject);
      }
    });
  }, []);

  const columns = useColumnSchema({ setAllStudents });
  const data = useMemo(() => Object.values(allStudents), [allStudents]);
  // const data = useMemo(() => [], [allStudents]);  // uncomment this line and comment the line above to see empty table state

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
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

  if (isLoading) return <p>Loading...</p>;

  if (Object.keys(allStudents).length === 0)
    return <p className="text-red-500">Please add a student first!</p>;

  return (
    <div className="w-full space-y-5 overflow-x-auto">
      <div className="flex w-full items-center justify-between">
        <h1
          className={cn(
            "font-['Alternate Gothic No3 D'] text-[40px] font-medium text-neutral-800",
            isTablet && "text-2xl",
          )}
        >
          Students
        </h1>
        {isTablet && <StudentFormButton type="add" setAllStudents={setAllStudents} />}
      </div>
      <Table
        className={cn(
          "h-fit w-[100%] min-w-[640px] max-w-[1120px] border-collapse rounded-lg bg-pia_primary_white",
          isTablet && "text-[12px]",
        )}
      >
        <THead
          table={table}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          setAllStudents={setAllStudents}
        />
        <TBody table={table} />
      </Table>
    </div>
  );
}
