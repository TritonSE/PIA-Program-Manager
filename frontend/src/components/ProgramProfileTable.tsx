import { useMemo } from "react";

import { Enrollment } from "../api/programs";

import { StudentMap } from "./StudentsTable/types";

import { useWindowSize } from "@/hooks/useWindowSize";

export type ProgramProfileTableProps = {
  enrollments: [Enrollment];
  allStudents: StudentMap;
  className?: string;
};

export function ProgramProfileTable({
  enrollments,
  allStudents,
  className,
}: ProgramProfileTableProps) {
  const { windowSize } = useWindowSize();
  const isTablet = useMemo(() => windowSize.width < 1024, [windowSize.width]);

  let outerDivClass = "";

  if (className) {
    outerDivClass = className;
  }

  const tableClass = "h-full w-full border-collapse";
  let tdClass = "border-pia_neutral_gray border-[1px]";
  let thClass = "bg-pia_light_gray border-t-0";
  let dotClass = "rounded-full";

  if (isTablet) {
    tdClass += " p-[8px] text-xs";
    dotClass += " my-[4px] mx-[8px] h-[8px] w-[8px]";
  } else {
    tdClass += " p-[12px] text-base";
    dotClass += " my-[8px] mr-[8px] h-[8px] w-[8px]";
  }

  thClass += " " + tdClass;

  function getStatus(status: string): React.JSX.Element {
    status = status.toLowerCase();
    if (status === "joined") {
      return (
        <div className="flex flex-row">
          <p className={dotClass + " bg-joined_green"} />
          <p className="text-joined_green">Joined</p>
        </div>
      );
    } else if (status === "waitlisted") {
      return (
        <div className="flex flex-row">
          <p className={dotClass + " bg-waitlisted_yellow"} />
          <p className="text-waitlisted_yellow">Waitlisted</p>
        </div>
      );
    } else if (status === "archived") {
      return (
        <div className="flex flex-row">
          <p className={dotClass + " bg-archived_gray"} />
          <p className="text-archived_gray">Archived</p>
        </div>
      );
    } else if (status === "not a fit") {
      return (
        <div className="flex flex-row">
          <p className={dotClass + " bg-notafit_red"} />
          <p className="text-notafit_red">Not a Fit</p>
        </div>
      );
    } else {
      return (
        <div className="flex flex-row">
          <p className={dotClass + " bg-black"} />
          <p className="text-black">Invalid</p>
        </div>
      );
    }

    // still need to add design for "completed"
  }

  function dateToString(date: Date): string {
    if (typeof date === "string") {
      date = new Date(date);
    }

    let monthString = "" + (date.getMonth() + 1);
    if (date.getMonth() < 9) {
      monthString = "0" + monthString;
    }

    const dateString = "" + monthString + "/" + date.getDate() + "/" + (date.getFullYear() % 100);

    return dateString;
  }

  function getName(id: string): string {
    let name = "No Name Found";
    Object.values(allStudents).forEach((studentObj) => {
      if (studentObj._id === id) {
        name = studentObj.student.firstName + " " + studentObj.student.lastName;
      }
    });

    return name;
  }

  return (
    <div className={outerDivClass}>
      <table className={tableClass}>
        <thead>
          <tr>
            <td className={thClass + " border-l-0"}>Student</td>
            <td className={thClass}>Status</td>
            <td className={thClass}>Days</td>
            <td className={thClass}>Start</td>
            <td className={thClass}>End</td>
            <td className={thClass}>Hrs Left</td>
            <td className={thClass + " border-r-0"}>Auth No.</td>
          </tr>
        </thead>

        {enrollments !== undefined && (
          <tbody>
            {enrollments.map((enrollment) => (
              <tr key={enrollment._id}>
                <td className={tdClass + " border-l-0"}>{getName(enrollment.studentId)}</td>
                <td className={tdClass}>{getStatus(enrollment.status)}</td>
                <td className={tdClass}>{enrollment.schedule.join("/")}</td>
                <td className={tdClass}>{dateToString(enrollment.startDate)}</td>
                <td className={tdClass}>{dateToString(enrollment.renewalDate)}</td>
                <td className={tdClass}>{enrollment.hoursLeft}</td>
                <td className={tdClass + " border-r-0"}>{enrollment.authNumber}</td>
              </tr>
            ))}
            <tr>
              <td className={tdClass}>temp</td>
            </tr>
            <tr>
              <td className={tdClass}>temp</td>
            </tr>
            <tr>
              <td className={tdClass}>temp</td>
            </tr>
            <tr>
              <td className={tdClass}>temp</td>
            </tr>
            <tr>
              <td className={tdClass}>temp</td>
            </tr>
            <tr>
              <td className={tdClass}>temp</td>
            </tr>
            <tr>
              <td className={tdClass}>temp</td>
            </tr>
            <tr>
              <td className={tdClass}>temp</td>
            </tr>
            <tr>
              <td className={tdClass}>temp</td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
}
