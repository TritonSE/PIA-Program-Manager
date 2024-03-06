import { useMemo } from "react";

import { Contact } from "../StudentForm/types";
import StudentFormButton from "../StudentFormButton";

import { Columns, StudentMap } from "./types";

import { formatPhoneNumber } from "@/lib/formatPhoneNumber";

export function useColumnSchema({
  setAllStudents,
}: {
  setAllStudents: React.Dispatch<React.SetStateAction<StudentMap>>;
}) {
  const columns: Columns = [
    {
      accessorKey: "student",
      header: "Name",
      accessorFn: (row) => row.student.firstName + " " + row.student.lastName,
      cell: (info) => <span className="pl-10">{info.getValue() as string}</span>,
      enableColumnFilter: false,
    },
    {
      accessorKey: "regularPrograms",
      id: "Curr. Program 1",
      header: "Curr. Program 1",
      accessorFn: (row) => row.regularPrograms.join(";"),
      cell: (info) => (
        <span className="rounded-[20px] bg-zinc-100 px-2.5">
          {(info.getValue() as string).split(";")[0] ?? ""}
        </span>
      ),
      filterFn: "arrIncludes",
    },
    {
      accessorKey: "regularPrograms",
      id: "Curr. Program 2",
      header: "Curr. Program 2",
      accessorFn: (row) => row.regularPrograms.join(";"),
      cell: (info) => (
        <span className="rounded-[20px] bg-zinc-100 px-2.5">
          {(info.getValue() as string).split(";")[1] ?? ""}
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
        <span className="underline">{(info.getValue() as string) + " programs"}</span>
      ),
      enableColumnFilter: false,
    },
    {
      accessorKey: "emergency",
      header: "Emergency Contact",
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

  return useMemo(() => columns, [setAllStudents]);
}
