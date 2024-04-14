import { Column } from "@tanstack/react-table";
import { useContext, useMemo } from "react";

import { Dropdown } from "../Dropdown";

import { ProgramsContext } from "./StudentsTable";
import { StudentTableRow } from "./types";

export default function ProgramFilter({ column }: { column: Column<StudentTableRow> }) {
  const programsMap = useContext(ProgramsContext);
  // Get unique programs to display in the program filter dropdown
  const sortedUniqueValues = useMemo(() => {
    const values = new Set(Object.values(programsMap).map((program) => program.name));

    return Array.from(values)
      .sort()
      .filter((v) => v !== "");
  }, [programsMap]);

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
