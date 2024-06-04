import { HeaderGroup, Table, flexRender } from "@tanstack/react-table";
import React from "react";

import DebouncedInput from "../DebouncedInput";
import { TableHead, TableHeader, TableRow } from "../ui/table";

import { ProgramFilter, StatusFilter } from "./FilterFns";
import { StudentTableRow } from "./types";

function TableActionsHeader({
  headerGroup,
  globalFilter,
  setGlobalFilter,
}: {
  headerGroup: HeaderGroup<StudentTableRow>;
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <TableRow className="border-b ">
      <TableHead className="h-6 w-full px-10 py-5" colSpan={6}>
        <div className="flex justify-between">
          <span className="flex gap-6">
            {headerGroup.headers.map((header) => {
              if (!header.column.getCanFilter()) return null;
              if (["Curr. Program 1", "Curr. P1"].includes(header.column.id)) {
                return <ProgramFilter key={header.id} column={header.column} />;
              } else if (["Curr. Program 2", "Curr. P2"].includes(header.column.id)) {
                return <StatusFilter key={header.id} column={header.column} />;
              }
              return null;
            })}
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
        </div>
      </TableHead>
    </TableRow>
  );
}

function TableDataHeader({ headerGroup }: { headerGroup: HeaderGroup<StudentTableRow> }) {
  return (
    <TableRow className="border-b">
      {headerGroup.headers.map((header) => (
        <TableHead
          key={header.id}
          className="h-6 px-0 py-7 text-neutral-800 first:pl-10 last:pr-10 last:text-right"
        >
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
  table,
}: {
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  table: Table<StudentTableRow>;
}) {
  return (
    <TableHeader className="text-left">
      {table.getHeaderGroups().map((headerGroup, i) => (
        <React.Fragment key={i}>
          <TableActionsHeader
            headerGroup={headerGroup}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
          <TableDataHeader headerGroup={headerGroup} />
        </React.Fragment>
      ))}
    </TableHeader>
  );
}
