import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { PlusIcon } from "lucide-react";
import React, { useContext, useEffect, useMemo, useState } from "react";

import { Button } from "../Button";
import LoadingSpinner from "../LoadingSpinner";
import StudentForm from "../StudentForm/StudentForm";
import StudentProfile from "../StudentProfile";
import { Table } from "../ui/table";

import { fuzzyFilter, programFilterFn, statusFilterFn } from "./FilterFns";
import TBody from "./TBody";
import THead from "./THead";
import { StudentTableRow } from "./types";
import { useColumnSchema } from "./useColumnSchema";

import { Student } from "@/api/students";
import { ProgramsContext } from "@/contexts/program";
import { StudentsContext } from "@/contexts/students";
import { UserContext } from "@/contexts/user";
import { useWindowSize } from "@/hooks/useWindowSize";
import { cn } from "@/lib/utils";

export type View = "View" | "Edit" | "List";

export default function StudentsTable() {
  const [currentView, setCurrentView] = useState<View>("List");
  const { allStudents, setAllStudents } = useContext(StudentsContext);
  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>(undefined);
  const [studentTable, setStudentTable] = useState<StudentTableRow[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { isTablet } = useWindowSize();

  const { allPrograms } = useContext(ProgramsContext);
  const { isAdmin } = useContext(UserContext);

  useEffect(() => {
    if (allStudents) {
      setIsLoading(false);
    }
  }, [allStudents]);

  useEffect(() => {
    if (!allStudents) {
      return;
    }
    const studentsInformation: StudentTableRow[] = Object.values(allStudents).map((studentObj) => {
      return {
        id: studentObj._id,
        student: studentObj.student.firstName + " " + studentObj.student.lastName,
        emergencyContact: studentObj.emergency,
        enrollments: studentObj.enrollments,
      } as StudentTableRow;
    });
    setStudentTable(studentsInformation);
  }, [allStudents]);

  const columns = useColumnSchema({
    allStudents,
    allPrograms,
    setAllStudents,
    setCurrentView,
    setSelectedStudent,
  });
  const data = useMemo(() => studentTable, [studentTable]);
  // const data = useMemo(() => [], [allStudents]);  // uncomment this line and comment the line above to see empty table state

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    filterFns: {
      fuzzy: fuzzyFilter,
      programFilter: programFilterFn,
      statusFilter: statusFilterFn,
    },
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  return (
    <div className="w-full space-y-5 overflow-x-auto">
      {currentView === "Edit" && (
        <section className="mx-[30px] grid space-y-[60px]">
          <div className="flex justify-between">
            <svg
              onClick={() => {
                setCurrentView("View");
              }}
              className="cursor-pointer"
              width="25"
              height="20"
              viewBox="0 0 10 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.10752 3.63111C0.878224 3.86041 0.878224 4.23216 1.10752 4.46146L4.04322 7.39716C4.27252 7.62646 4.64427 7.62646 4.87357 7.39716C5.10286 7.16787 5.10286 6.79611 4.87357 6.56682L2.94017 4.63343L8.56838 4.63343C8.89265 4.63343 9.15553 4.37055 9.15553 4.04629C9.15553 3.72202 8.89265 3.45914 8.56838 3.45914L2.94017 3.45914L4.87357 1.52575C5.10286 1.29646 5.10286 0.9247 4.87357 0.695407C4.64427 0.466114 4.27252 0.466114 4.04322 0.695407L1.10752 3.63111Z"
                fill="black"
              />
            </svg>
          </div>
          <StudentForm data={null} type="add" setCurrentView={setCurrentView} />
        </section>
      )}

      {currentView === "View" && selectedStudent && (
        <StudentProfile studentData={selectedStudent} setStudentData={setSelectedStudent} />
      )}

      {currentView === "List" && (
        <>
          <div className="flex w-full items-center justify-between">
            <h1
              className={cn(
                "font-[alternate-gothic] text-4xl font-medium leading-none text-neutral-800",
                isTablet && "text-2xl",
              )}
            >
              Students
            </h1>
            {isAdmin && (
              <Button
                label="Add Student"
                icon={<PlusIcon />}
                onClick={() => {
                  setCurrentView("Edit");
                }}
              />
            )}
          </div>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <Table
              className={cn(
                "h-fit w-[100%] min-w-[640px] max-w-[1480px] border-collapse rounded-lg bg-pia_primary_white font-['Poppins']",
                isTablet && "text-[12px]",
              )}
            >
              <THead table={table} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
              <TBody table={table} />
            </Table>
          )}
        </>
      )}
    </div>
  );
}
