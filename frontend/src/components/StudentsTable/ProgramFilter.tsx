import { Column } from "@tanstack/react-table";
import { useMemo } from "react";

import { Student } from "../../api/students";
import { Dropdown } from "../Dropdown";

export default function ProgramFilter({ column }: { column: Column<Student> }) {
  // Get unique programs to display in the program filter dropdown
  const sortedUniqueValues = useMemo(() => {
    const values = new Set<string>();

    Array.from(column.getFacetedUniqueValues().keys() as unknown as string[])
      .sort()
      .forEach((programs: string) => programs.split(";").map((v: string) => values.add(v)));

    return Array.from(values)
      .sort()
      .filter((v) => v !== "");
  }, [column.getFacetedUniqueValues()]);

  return (
    <Dropdown
      label="Program"
      name="program"
      placeholder="Program"
      className="rounded-md"
      defaultValue="All Programs"
      options={sortedUniqueValues}
      onChange={(value) => {
        column.setFilterValue(value);
      }}
    />
  );
}
