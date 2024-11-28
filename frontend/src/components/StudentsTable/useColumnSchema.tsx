import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Contact, Enrollment, ProgramLink } from "../StudentForm/types";

import { Columns, ProgramMap, StudentMap } from "./types";

import { Program } from "@/api/programs";
import { useWindowSize } from "@/hooks/useWindowSize";
import { formatPhoneNumber } from "@/lib/formatPhoneNumber";
import { cn } from "@/lib/utils";

const poppins = Poppins({ weight: ["400", "700"], style: "normal", subsets: [] });

const ProgramPill = ({ name, color }: { name: string; color: string }) => {
  const { isTablet } = useWindowSize();

  return (
    <span
      className={cn(
        "rounded-[20px] px-2.5 font-[Poppins] text-sm font-bold",
        poppins.className,
        isTablet ? "text-[12px]" : "",
      )}
      style={{ background: `${color}45`, color }}
    >
      {name}
    </span>
  );
};

const PopoverInfoRow = ({ label, value }: { label: string; value: string }) => (
  <span className="capitalize text-neutral-400">
    {label}: <span className="text-black">{value}</span>
  </span>
);

const ProgramPopover = ({ link, program }: { link: ProgramLink; program: Program }) => {
  if (!program) return null;
  const rowInfo = [
    ["Type", program.type],
    ["Schedule", program.daysOfWeek.join(", ")],
    ["Start Date", new Date(/*program.startDate*/).toLocaleDateString("en-US")],
    ["Renewal Date", new Date(/*program.endDate*/).toLocaleDateString("en-US")],
    ["Hours Left", link.hoursLeft.toString()],
  ];

  return (
    <Popover>
      <PopoverTrigger>
        <ProgramPill name={program.abbreviation} color={program.color} />
      </PopoverTrigger>
      <PopoverContent className="flex w-[225px] flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow">
        <div className="text-base">{program.name}</div>
        <div className="flex flex-col gap-2">
          {rowInfo.map(([label, value], i) => (
            <PopoverInfoRow key={i} label={label} value={value} />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const ProgramHistoryPopover = ({
  enrollments,
  allPrograms,
}: {
  enrollments: Enrollment[];
  allPrograms: ProgramMap;
}) => {
  return (
    <Popover>
      <PopoverTrigger className="pr-2.5 underline">
        {enrollments.length + " programs"}
      </PopoverTrigger>
      <PopoverContent className="flex w-[290px] flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow">
        <div className="text-base">Program History</div>
        <div className="flex flex-col gap-3">
          {enrollments.map((enrollment, i) => {
            const progInfo = allPrograms[enrollment.programId];
            return (
              progInfo && (
                <div key={i}>
                  <ProgramPill name={progInfo.abbreviation} color={progInfo.color} />
                  <span className="ml-6 text-sm">
                    {enrollment.status}
                    <span className="text-neutral-400">
                      {" on " + new Date(enrollment.dateUpdated).toLocaleDateString("en-US")}
                    </span>
                  </span>
                </div>
              )
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export function useColumnSchema({
  allStudents,
  allPrograms,
  setAllStudents,
}: {
  allStudents: StudentMap;
  allPrograms: ProgramMap;
  setAllStudents: React.Dispatch<React.SetStateAction<StudentMap>>;
}) {
  const { isTablet } = useWindowSize();

  const columns: Columns = [
    {
      accessorKey: "student",
      header: "Name",
      cell: (info) => (
        <span className="truncate pl-10 pr-2.5 hover:text-clip">{info.getValue() as string}</span>
      ),
      enableColumnFilter: false,
    },
    {
      accessorKey: "enrollments",
      id: isTablet ? "Curr. P1" : "Curr. Program 1",
      header: isTablet ? "Curr. P1" : "Curr. Program 1",
      cell: (info) => {
        const enrollments = info.getValue() as unknown as ProgramLink[];
        const link = enrollments.filter((enr) => enr.status === "Joined")[0];
        if (!link) return null;
        const program = allPrograms[link.programId];
        return <ProgramPopover link={link} program={program} />;
      },
      filterFn: "programFilter",
    },
    {
      accessorKey: "enrollments",
      id: isTablet ? "Curr. P2" : "Curr. Program 2",
      header: isTablet ? "Curr. P2" : "Curr. Program 2",
      cell: (info) => {
        const enrollments = info.getValue() as unknown as ProgramLink[];
        const link = enrollments.filter((enr) => enr.status === "Joined")[1];
        if (!link) return null;
        const program = allPrograms[link.programId];
        return <ProgramPopover link={link} program={program} />;
      },
      filterFn: "statusFilter",
    },
    {
      id: "enrollments",
      header: "Program History",
      accessorFn: (row) => row.enrollments.length.toString(),
      cell: (info) => {
        return (
          <ProgramHistoryPopover
            enrollments={info.row.original.enrollments}
            allPrograms={allPrograms}
          />
        );
      },
      enableColumnFilter: false,
    },
    {
      accessorKey: "emergencyContact",
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
      header: "Actions",
      accessorKey: "id",
      cell: (info) => {
        return (
          <div className="flex justify-end pr-10">
            <Link href={`/student/${allStudents[info.getValue() as string]._id}`}>
              <Image
                src="/eye.svg"
                alt="view student"
                width={40}
                height={40}
                className="cursor-pointer"
              />
            </Link>
          </div>
        );
      },
      enableColumnFilter: false,
    },
  ];

  return useMemo(() => columns, [setAllStudents, isTablet, allPrograms, allStudents]);
}
