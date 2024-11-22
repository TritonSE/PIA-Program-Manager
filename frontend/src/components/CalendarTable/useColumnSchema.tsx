import { useMemo } from "react";

import { ProgramLink } from "../StudentForm/types";
import { ProgramMap } from "../StudentsTable/types";
import { ProgramPill } from "../StudentsTable/useColumnSchema";

import { Columns } from "./types";

export function useColumnSchema({ allPrograms }: { allPrograms: ProgramMap }) {
  const columns: Columns = [
    {
      accessorKey: "profilePicture",
      header: "Profile Picture",
      cell: () => <span className="truncate pl-10 pr-2.5 hover:text-clip">filler</span>,
      enableColumnFilter: false,
    },
    {
      accessorKey: "student",
      header: "Student Name",
      cell: (info) => (
        <span className="truncate pl-10 pr-2.5 hover:text-clip">{info.getValue() as string}</span>
      ),
      enableColumnFilter: false,
    },
    {
      accessorKey: "programs",
      header: "Attendance",
      cell: (info) => {
        const programLink = info.getValue() as unknown as ProgramLink;
        const link = programLink.programId;
        const program = allPrograms[link];
        return <ProgramPill name={program.abbreviation} color={program.color} />;
      },
    },
  ];

  return useMemo(() => columns, [allPrograms]);
}
