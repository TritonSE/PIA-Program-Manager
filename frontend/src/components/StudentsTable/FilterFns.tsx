import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import { Column, FilterFn } from "@tanstack/react-table";
import { useContext, useMemo } from "react";

import { Dropdown } from "../Dropdown";
import { ProgramLink } from "../StudentForm/types";

import { StudentTableRow } from "./types";

import { ProgramsContext } from "@/contexts/program";
import { cn } from "@/lib/utils";

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

export function ProgramFilter({
  setValue,
  className,
}: {
  setValue: (value: string) => void;
  className?: string;
}) {
  const { allPrograms } = useContext(ProgramsContext);
  // Get unique programs to display in the program filter dropdown
  const sortedUniqueValues = useMemo(() => {
    const values = new Set(Object.values(allPrograms).map((program) => program.name));

    return Array.from(values)
      .sort()
      .filter((v) => v !== "");
  }, [allPrograms]);

  // Create a map from program name to program id for easy lookup (dropdown uses names but filter needs ids)
  const programNameToId = useMemo(() => {
    const map: Record<string, string> = {};
    for (const [id, program] of Object.entries(allPrograms)) {
      map[program.name] = id;
    }
    return map;
  }, [allPrograms]);

  return (
    <Dropdown
      name="program"
      placeholder="Program"
      className={cn(`rounded-md`, className)}
      defaultValue="All Programs"
      options={sortedUniqueValues}
      onChange={(value): void => {
        setValue(programNameToId[value] || "");
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
  const statusOptions = ["Joined", "Waitlisted", "Archived", "Not a fit"];

  return (
    <Dropdown
      name="status"
      placeholder="Status"
      className={`rounded-md`}
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
