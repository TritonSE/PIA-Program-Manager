import { Table, flexRender } from "@tanstack/react-table";
import Image from "next/image";

import { TableBody, TableCell, TableRow } from "../ui/table";

import { CalendarTableRow } from "./types";

export default function TBody({ table }: { table: Table<CalendarTableRow> }) {
  // If there are no students, display a placeholder
  if (table.getRowModel().rows.length === 0) {
    return (
      <TableBody className="pl-10 pr-10">
        <TableRow>
          <TableCell colSpan={6} className="h-[250px] w-full">
            <div className="flex flex-col items-center justify-center gap-2">
              <Image src="/noStudents.svg" width={57} height={57} alt="no students placeholder" />

              <span className="text-2xl text-neutral-500">No Students</span>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody className="pl-10 pr-10">
      {table.getRowModel().rows.map((row) => (
        <TableRow key={row.id} className="border-b">
          {row.getVisibleCells().map((cell) => (
            <TableCell
              key={cell.id}
              className="h-8 px-0 py-4 text-center"
              style={{
                width: cell.column.getSize(),
              }}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}
