import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import { FilterFn } from "@tanstack/react-table";

import { Student } from "@/api/students";
import { StudentTableRow } from "@/components/StudentsTable/types";

/* eslint-disable */
declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}
/* eslint-enable */

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
