import { useMemo, useEffect, useState } from "react";
import { Student, getAllStudents } from "../api/students";
import StudentFormButton from "../components/StudentFormButton";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown"
export type StudentMap = Record<string, Student>;

export default function Home() {
  const [allStudents, setAllStudents] = useState<StudentMap>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllStudents().then(
      (result) => {
        if (result.success) {
          // Convert student array to object with keys as ids and values as corresponding student
          const studentsObject = result.data.reduce((obj, student) => {
            obj[student._id] = student;
            return obj;
          }, {} as StudentMap);
          setAllStudents(studentsObject);
          setIsLoading(false);
        } else {
          console.log(result.error);
        }
      },
      (error) => {
        console.log(error);
      },
    );
  }, []);

  const columns: ColumnDef<Student, any>[] = [
    {
      accessorKey: "student",
      header: "Name",
      cell: (info) => <span>{info.getValue().firstName + " " + info.getValue().lastName}</span>,
    },
    {
      accessorKey: "regularPrograms",
      id: "Curr. Program 1",
      header: "Curr. Program 1",
      cell: (info) => <span>{info.getValue()[0] || ""}</span>,
    },
    {
      accessorKey: "regularPrograms",
      id: "Curr. Program 2",
      header: "Curr. Program 2",
      cell: (info) => <span>{info.getValue()[1] || ""}</span>,
    },
    {
      accessorKey: "regularPrograms",
      id: "Program History",
      header: "Program History",
      cell: (info) => <span>{info.getValue().length + " programs"}</span>,
    },
    {
      accessorKey: "emergency",
      header: "Emergency Contact",
      cell: (info) => (
        <div className="flex flex-col">
          <span>{info.getValue().firstName + " " + info.getValue().lastName}</span>
          <span className="text-pia_neutral_gray">{info.getValue().phoneNumber}</span>
        </div>
      ),
    },
    {
      header: "None",
      cell: (info) => {
        return (
          <StudentFormButton type="edit" data={info.row.original} setAllStudents={setAllStudents} />
        );
      },
    },
  ];

  const data = useMemo(() => Object.values(allStudents), [allStudents]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <p>Loading...</p>;

  if (Object.keys(allStudents).length === 0)
    return <p className="text-red-500">Please add a student first!</p>;

  return (
    <div className="w-1/2 space-y-5">
      {/* <DropdownMenu>
      <DropdownMenuTrigger>Program: </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu> */}

      <StudentFormButton type="add" setAllStudents={setAllStudents} />

      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
