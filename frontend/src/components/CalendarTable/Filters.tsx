import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import { FilterFn, Table } from "@tanstack/react-table";
import React from "react";

import SearchIcon from "../../../public/icons/search.svg";
import DebouncedInput from "../DebouncedInput";
import { ProgramLink } from "../StudentForm/types";
import { ProgramFilter } from "../StudentsTable/FilterFns";

import { CalendarTableRow } from "./types";

// Extend the FilterFns and FilterMeta interfaces
/* eslint-disable */
declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
    programFilter: FilterFn<unknown>;
    statusFilter: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}
/* eslint-enable */

export const programFilterFn: FilterFn<unknown> = (rows, id, filterValue) => {
  if (filterValue === "") return true; // no filter case
  let containsProgram = false;
  const programLinks: ProgramLink[] = rows.getValue(id);
  programLinks.forEach((prog) => {
    if (prog.programId === filterValue && prog.status === "Joined") {
      containsProgram = true;
    }
  });
  return containsProgram;
};

export const statusFilterFn: FilterFn<unknown> = (rows, id, filterValue) => {
  if (filterValue === "") return true; // no filter case
  let containsStatus = false;
  const programLinks: ProgramLink[] = rows.getValue(id);
  programLinks.forEach((prog) => {
    if (prog.status === filterValue) {
      containsStatus = true;
    }
  });
  return containsStatus;
};

// Filter function from tanstack docs for global filter (search in students )
export const fuzzyFilter: FilterFn<CalendarTableRow> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value as string);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

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
    <div className="mb-6 flex items-center space-x-4">
      {/* Global Search Filter */}
      <div className="flex h-12 items-center rounded-lg border border-gray-300 bg-white px-3 py-2">
        <SearchIcon width="20" height="20" className="mr-2 text-gray-400" />
        <DebouncedInput
          value={globalFilter ?? ""}
          onChange={(val) => {
            setGlobalFilter(val);
          }}
          placeholder="Search in Students"
          className="w-full border-none text-gray-600 outline-none"
        />
      </div>

      {/* Program Filter */}
      {table.getHeaderGroups().map((headerGroup) => (
        <React.Fragment key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            if (header.column.id === "programs" && header.column.getCanFilter()) {
              return (
                <ProgramFilter
                  key={header.id}
                  setValue={header.column.setFilterValue}
                  className="h-12 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700"
                />
              );
            }
            return null;
          })}
        </React.Fragment>
      ))}
    </div>
  );
}
