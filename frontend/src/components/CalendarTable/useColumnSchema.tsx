import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

import { ProgramMap } from "../StudentsTable/types";
import { ProgramPill } from "../StudentsTable/useColumnSchema";

import { Columns, EnrollmentLink } from "./types";

export function useColumnSchema({ allPrograms }: { allPrograms: ProgramMap }) {
  const columns: Columns = [
    {
      accessorKey: "profilePicture",
      header: "Profile Picture",
      cell: (info) => (
        <div className="flex h-full w-full items-center justify-center">
          <Image
            alt="Profile Picture"
            src={(info.getValue() as string) === "default" ? "../defaultProfilePic.svg" : ""}
            className="rounded-full object-cover"
            width={50}
            height={50}
          />
        </div>
      ),
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
        const enrollmentLink = info.getValue() as unknown as EnrollmentLink;
        const studentId = enrollmentLink.studentId;
        const programId = enrollmentLink.programId;
        const program = allPrograms[programId];
        return (
          <Link
            href={{
              pathname: "./calendar",
              query: {
                student: studentId,
                program: programId,
              },
            }}
          >
            <ProgramPill name={program.abbreviation} color={program.color} />
          </Link>
        );
      },
    },
  ];

  return useMemo(() => columns, [allPrograms]);
}
