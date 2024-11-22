import { Table } from "@tanstack/react-table";
import React from "react";

import SearchIcon from "../../../public/icons/search.svg";
import DebouncedInput from "../DebouncedInput";
import { ProgramFilter } from "../StudentsTable/FilterFns";

import { CalendarTableRow } from "./types";

export default function Filter({
  globalFilter,
  setGlobalFilter,
  table,
}: {
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  table: Table<CalendarTableRow>;
}) {
  return (
    <div>
      {table.getHeaderGroups().map((headerGroup) => (
        <React.Fragment key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            if (!header.column.getCanFilter()) return null;
            if (header.column.id === "Attendance") {
              return <ProgramFilter key={header.id} setValue={header.column.setFilterValue} />;
            }
            return null;
          })}
          <DebouncedInput
            icon={<SearchIcon width="20" height="20" />}
            value={globalFilter ?? ""}
            onChange={(val) => {
              setGlobalFilter(val);
            }}
            placeholder="Search in Students"
            className="h-full min-w-[200px] p-0  px-2"
          />
        </React.Fragment>
      ))}
    </div>
  );
}
