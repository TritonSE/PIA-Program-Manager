import { useEffect, useMemo } from "react";

import { Contact } from "../StudentForm/types";
import StudentFormButton from "../StudentFormButton";

import { Columns, StudentMap } from "./types";

import { useWindowSize } from "@/hooks/useWindowSize";
import { formatPhoneNumber } from "@/lib/formatPhoneNumber";

export function useColumnSchema({
  setAllStudents,
}: {
  setAllStudents: React.Dispatch<React.SetStateAction<StudentMap>>;
}) {
  const { isTablet } = useWindowSize();

  useEffect(() => {
    console.log(isTablet);
  }, [isTablet]);

  const columns: Columns = [
    {
      accessorKey: "student",
      header: "Name",
      accessorFn: (row) => row.student.firstName + " " + row.student.lastName,
      cell: (info) => (
        <span className="truncate pl-10 pr-2.5 hover:text-clip">{info.getValue() as string}</span>
      ),
      enableColumnFilter: false,
    },
    {
      accessorKey: "regularPrograms",
      id: isTablet ? "Curr. P1" : "Curr. Program 1",
      header: isTablet ? "Curr. P1" : "Curr. Program 1",
      accessorFn: (row) => row.regularPrograms.join(";"),
      cell: (info) =>
        (info.getValue() as string).split(";")[0] && (
          <span className="rounded-[20px] bg-red-100 px-2.5 font-bold text-red-400">
            {(info.getValue() as string).split(";")[0]}
          </span>
        ),
      filterFn: "arrIncludes",
    },
    {
      accessorKey: "regularPrograms",
      id: isTablet ? "Curr. P2" : "Curr. Program 2",
      header: isTablet ? "Curr. P2" : "Curr. Program 2",
      accessorFn: (row) => row.regularPrograms.join(";"),
      cell: (info) =>
        (info.getValue() as string).split(";")[1] && (
          <span className="rounded-[20px] bg-yellow-100 px-2.5 font-bold text-yellow-500">
            {(info.getValue() as string).split(";")[1]}
          </span>
        ),
      enableColumnFilter: false,
    },
    {
      accessorKey: "regularPrograms",
      id: "Program History",
      header: "Program History",
      accessorFn: (row) => row.regularPrograms.length.toString(),
      cell: (info) => (
        <span className="pr-2.5 underline">{(info.getValue() as string) + " programs"}</span>
      ),
      enableColumnFilter: false,
    },
    {
      accessorKey: "emergency",
      header: "Emergency Contact",
      size: 200,
      cell: (info) => {
        const contact = info.getValue() as Contact;
        return (
          <div className="flex flex-col">
            <span>{contact.firstName + " " + contact.lastName}</span>
            <span className="text-neutral-500">{formatPhoneNumber(contact.phoneNumber)}</span>
          </div>
        );
      },
      enableColumnFilter: false,
    },
    {
      id: "Actions",
      cell: (info) => {
        return (
          <div className="flex justify-end pr-10">
            <StudentFormButton
              type="edit"
              data={info.row.original}
              setAllStudents={setAllStudents}
            />
          </div>
        );
      },
    },
  ];

  return useMemo(() => columns, [setAllStudents, isTablet]);
}
