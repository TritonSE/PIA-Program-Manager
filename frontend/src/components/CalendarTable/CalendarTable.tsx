import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useContext, useEffect, useMemo, useState } from "react";

import LoadingSpinner from "../LoadingSpinner";
import { Table } from "../ui/table";

// eslint-disable-next-line import/order
import Filter, { fuzzyFilter, programFilterFn, statusFilterFn } from "./Filters";

// import Filter from "./Filters";
import TBody from "./TBody";
import THead from "./THead";
import { CalendarTableRow } from "./types";
import { useColumnSchema } from "./useColumnSchema";

import { getPhoto } from "@/api/user";
import { ProgramsContext } from "@/contexts/program";
// import { UserContext } from "@/contexts/user";
import { StudentsContext } from "@/contexts/students";
import { UserContext } from "@/contexts/user";
import { useWindowSize } from "@/hooks/useWindowSize";
import { cn } from "@/lib/utils";

export default function CalendarTable() {
  const { allStudents } = useContext(StudentsContext);
  const [isLoading, setIsLoading] = useState(true);
  const [calendarTable, setCalendarTable] = useState<CalendarTableRow[]>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const { isTablet } = useWindowSize();
  const [firebaseToken, setFirebaseToken] = useState("");

  const { allPrograms } = useContext(ProgramsContext);
  const { firebaseUser } = useContext(UserContext);

  useEffect(() => {
    if (firebaseUser) {
      firebaseUser
        ?.getIdToken()
        .then((token) => {
          setFirebaseToken(token);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [firebaseUser]);

  useEffect(() => {
    if (allStudents) {
      setIsLoading(false);
    }
  }, [allStudents]);

  // Take all students and put them in rows for table
  useEffect(() => {
    const fetchTableRows = async () => {
      if (!allStudents) {
        return;
      }
      const tableRows = await Promise.all(
        Object.values(allStudents).flatMap((student) => {
          // Generate a row for each program the student is enrolled in
          // Todo: add profile picture to row
          return Promise.all(
            student.enrollments.map(async (enrollment) => {
              let profilePicture = "default";
              if (student.profilePicture !== "default") {
                const photoResult = await getPhoto(
                  student.profilePicture,
                  student._id,
                  "student",
                  firebaseToken,
                );
                if (photoResult.success) {
                  profilePicture = photoResult.data;
                } else {
                  console.error(photoResult.error);
                }
              }
              return {
                id: student._id,
                profilePicture,
                student: `${student.student.firstName} ${student.student.lastName}`,
                programs: {
                  programId: enrollment.programId,
                  status: enrollment.status,
                  dateUpdated: enrollment.dateUpdated,
                  hoursLeft: enrollment.hoursLeft,
                  studentId: student._id,
                },
              } as CalendarTableRow;
            }),
          );
        }),
      );

      setCalendarTable(tableRows.flat());
    };
    fetchTableRows()
      .then(() => {
        console.log("Table Rows Loaded");
      })
      .catch((error) => {
        console.error(error);
      });
  }, [allStudents]);

  const columns = useColumnSchema({ allPrograms });
  const data = useMemo(() => calendarTable, [calendarTable]);

  // have to make different filter functions
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
    debugColumns: true,
  });

  return (
    <div className="w-full space-y-5 overflow-x-auto">
      <div className="flex w-full flex-col items-start justify-between space-y-10">
        <h1
          className={cn(
            "font-[alternate-gothic] text-4xl font-medium leading-none text-neutral-800",
            isTablet && "text-2xl",
          )}
        >
          Calendar
        </h1>

        <p>Choose a Student to View Attendance</p>

        <Filter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} table={table} />
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
          <THead table={table} />
          <TBody table={table} />
        </Table>
      )}
    </div>
  );
}
