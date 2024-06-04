import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import { Column, FilterFn } from "@tanstack/react-table";
import { useContext, useMemo } from "react";

import { Dropdown } from "../Dropdown";
import { ProgramLink } from "../StudentForm/types";

import { ProgramsContext } from "./StudentsTable";
import { StudentTableRow } from "./types";

import { useWindowSize } from "@/hooks/useWindowSize";

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

export function ProgramFilter({ column }: { column: Column<StudentTableRow> }) {
  const { isTablet } = useWindowSize();

  const programsMap = useContext(ProgramsContext);
  // Get unique programs to display in the program filter dropdown
  const sortedUniqueValues = useMemo(() => {
    const values = new Set(Object.values(programsMap).map((program) => program.name));

    return Array.from(values)
      .sort()
      .filter((v) => v !== "");
  }, [programsMap]);

  // Create a map from program name to program id for easy lookup (dropdown uses names but filter needs ids)
  const programNameToId = useMemo(() => {
    const map: Record<string, string> = {};
    for (const [id, program] of Object.entries(programsMap)) {
      map[program.name] = id;
    }
    return map;
  }, [programsMap]);

  return (
    <Dropdown
      label="Program"
      name="program"
      className={`rounded-md ${isTablet ? "w-[200px]" : "w-[244px]"}`}
      defaultValue="All Programs"
      options={sortedUniqueValues}
      onChange={(value): void => {
        column.setFilterValue(programNameToId[value] || "");
      }}
    />
  );
}

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

export function StatusFilter({ column }: { column: Column<StudentTableRow> }) {
  const { isTablet } = useWindowSize();
  const statusOptions = ["Joined", "Waitlisted", "Archived", "Not a fit"];

  return (
    <Dropdown
      label="Status"
      name="status"
      className={`rounded-md ${isTablet ? "w-[200px]" : "w-[244px]"}`}
      defaultValue="All Statuses"
      options={statusOptions}
      onChange={(value): void => {
        column.setFilterValue(value);
      }}
    />
  );
}

// Filter function from tanstack docs for global filter (search in students )
export const fuzzyFilter: FilterFn<StudentTableRow> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value as string);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};
