import { HeaderGroup, Table, flexRender } from "@tanstack/react-table";
import React from "react";

import DebouncedInput from "../DebouncedInput";
import StudentFormButton from "../StudentFormButton";
import { TableHead, TableHeader, TableRow } from "../ui/table";

import ProgramFilter from "./ProgramFilter";
import { StudentMap, StudentTableRow } from "./types";

import { useWindowSize } from "@/hooks/useWindowSize";

function TableActionsHeader({
  headerGroup,
  globalFilter,
  setGlobalFilter,
  setAllStudents,
}: {
  headerGroup: HeaderGroup<StudentTableRow>;
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  setAllStudents: React.Dispatch<React.SetStateAction<StudentMap>>;
}) {
  const { isTablet } = useWindowSize();

  return (
    <TableRow key={headerGroup.id + "1"} className="border-b">
      <TableHead className="h-6 w-full px-10 py-5" colSpan={6}>
        <div className="flex justify-between">
          <span className="flex gap-6">
            {headerGroup.headers.map((header) =>
              header.column.getCanFilter() ? (
                <ProgramFilter key={header.id} column={header.column} />
              ) : null,
            )}
            <div className="w-[200px]">
              <DebouncedInput
                value={globalFilter ?? ""}
                onChange={(val) => {
                  setGlobalFilter(val);
                }}
                className="font-lg border-block border p-2 shadow"
                placeholder="Search in Students"
              />
            </div>
          </span>
          {!isTablet && <StudentFormButton type="add" setAllStudents={setAllStudents} />}
        </div>
      </TableHead>
    </TableRow>
  );
}

function TableDataHeader({ headerGroup }: { headerGroup: HeaderGroup<StudentTableRow> }) {
  return (
    <TableRow key={headerGroup.id + "2"} className="border-b">
      {headerGroup.headers.map((header) => (
        <TableHead key={header.id} className="h-6 px-0 py-7 first:pl-10 last:pr-10 last:text-right">
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}
        </TableHead>
      ))}
    </TableRow>
  );
}

export default function THead({
  globalFilter,
  setGlobalFilter,
  setAllStudents,
  table,
}: {
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  setAllStudents: React.Dispatch<React.SetStateAction<StudentMap>>;
  table: Table<StudentTableRow>;
}) {
  return (
    <TableHeader className="text-left">
      {table.getHeaderGroups().map((headerGroup) => (
        <React.Fragment key={headerGroup.id}>
          <TableActionsHeader
            headerGroup={headerGroup}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            setAllStudents={setAllStudents}
          />
          <TableDataHeader headerGroup={headerGroup} />
        </React.Fragment>
      ))}
    </TableHeader>
  );
}
