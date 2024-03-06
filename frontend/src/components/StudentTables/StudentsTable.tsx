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
import { Table } from "../ui/table";

import TBody from "./TableBody";
import THead from "./TableHeader";
import { StudentMap } from "./types";
import { useColumnSchema } from "./useColumnSchema";

export default function StudentTable() {
  const [allStudents, setAllStudents] = useState<StudentMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    getAllStudents().then(
      (result) => {
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
    defaultColumn: {
      size: 0,
      maxSize: 300,
    },
  });

  if (isLoading) return <p>Loading...</p>;

  if (Object.keys(allStudents).length === 0)
    return <p className="text-red-500">Please add a student first!</p>;

  return (
    <div className="w-fit space-y-5 overflow-x-auto">
      <h1 className="text-[40px] font-medium text-neutral-800">Students</h1>
      <Table className="h-fit w-[1120px] border-collapse rounded-lg bg-pia_primary_white">
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
