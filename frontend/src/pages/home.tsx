import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";

import { Student, getAllStudents } from "../api/students";
import DebouncedInput from "../components/DebouncedInput";
import { Dropdown } from "../components/Dropdown";
import StudentFormButton from "../components/StudentFormButton";
import { fuzzyFilter } from "../lib/fuzzyFilter";

export type StudentMap = Record<string, Student>;

export default function Home() {
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

  const columns: ColumnDef<Student, any>[] = [
    {
      accessorKey: "student",
      header: "Name",
      accessorFn: (row) => row.student.firstName + " " + row.student.lastName,
      cell: (info) => <span>{info.getValue()}</span>,
      enableColumnFilter: false,
    },
    {
      accessorKey: "regularPrograms",
      id: "Curr. Program 1",
      header: "Curr. Program 1",
      accessorFn: (row) => row.regularPrograms.join(";"),
      cell: (info) => <span>{info.getValue().split(";")[0] ?? ""}</span>,
      filterFn: "arrIncludes",
    },
    {
      accessorKey: "regularPrograms",
      id: "Curr. Program 2",
      header: "Curr. Program 2",
      accessorFn: (row) => row.regularPrograms.join(";"),
      cell: (info) => <span>{info.getValue().split(";")[1] ?? ""}</span>,
      enableColumnFilter: false,
    },
    {
      accessorKey: "regularPrograms",
      id: "Program History",
      header: "Program History",
      accessorFn: (row) => row.regularPrograms.length,
      cell: (info) => <span>{info.getValue() + " programs"}</span>,
      enableColumnFilter: false,
    },
    {
      accessorKey: "emergency",
      header: "Emergency Contact",
      cell: (info) => (
        <div className="flex flex-col">
          <span>{info.getValue().firstName + " " + info.getValue().lastName}</span>
          <span className="text-pia_neutral_gray">{info.getValue().phoneNumber}</span>
        </div>
      ),
      enableColumnFilter: false,
    },
    {
      id: "Actions",
      cell: (info) => {
        return (
          <StudentFormButton type="edit" data={info.row.original} setAllStudents={setAllStudents} />
        );
      },
    },
  ];

  const data = useMemo(() => Object.values(allStudents), [allStudents]);

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
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  if (isLoading) return <p>Loading...</p>;

  if (Object.keys(allStudents).length === 0)
    return <p className="text-red-500">Please add a student first!</p>;

  return (
    <div className="w-full space-y-5">
      <table className="h-fit w-full max-w-[1120px] border-collapse border-spacing-y-5 rounded-lg bg-pia_primary_white">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <>
              <tr key={headerGroup.id + "1"} className="border-b ">
                {headerGroup.headers.map((header) =>
                  header.column.getCanFilter() ? (
                    <th key={header.id} className="h-6 py-7">
                      <ProgramFilter column={header.column} />
                    </th>
                  ) : null,
                )}
                <th className="h-6 py-7">
                  <DebouncedInput
                    value={globalFilter ?? ""}
                    onChange={(val) => {
                      setGlobalFilter(val);
                    }}
                    className="font-lg border-block border p-2 shadow"
                    placeholder="Search all columns..."
                  />
                </th>
                <th className="h-6 py-7">
                  <StudentFormButton type="add" setAllStudents={setAllStudents} />
                </th>
              </tr>
              <tr key={headerGroup.id + "2"} className="border-b first:pl-10 last:pr-10">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="h-6 py-7">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            </>
          ))}
        </thead>
        <tbody className="pl-10 pr-10">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b first:pl-10 last:pr-10">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="h-8 py-4">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProgramFilter({ column }: { column: Column<Student, any> }) {
  const sortedUniqueValues = useMemo(() => {
    const values = new Set<string>();

    Array.from(column.getFacetedUniqueValues().keys())
      .sort()
      .forEach((programs) => programs.split(",").map((v: string) => values.add(v)));

    return Array.from(values)
      .sort()
      .filter((v) => v !== "");
  }, [column.getFacetedUniqueValues()]);

  return (
    <Dropdown
      label="Program"
      name="program"
      placeholder="Program"
      className="w-36 rounded border shadow"
      defaultValue="All Programs"
      options={sortedUniqueValues}
      onChange={(value) => {
        column.setFilterValue(value);
      }}
    />
  );
}
