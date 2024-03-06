import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import { FilterFn } from "@tanstack/react-table";

import { Student } from "@/api/students";

declare module "@tanstack/table-core" {
  type FilterFns = {
    fuzzy: FilterFn<unknown>;
  };
  type FilterMeta = {
    itemRank: RankingInfo;
  };
}

export const fuzzyFilter: FilterFn<Student> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value as string);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};
