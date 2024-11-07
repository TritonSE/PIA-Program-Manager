import { LegacyRef } from "react";

import { Student } from "../api/students";
import { EnrollmentDisplayInfo } from "./StudentProfile";

type PrintComponentProps = {
  data: Student;
  contentRef: LegacyRef<HTMLDivElement> | undefined;
  enrollments: EnrollmentDisplayInfo[];
};

type PrintContactProps = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  header: string;
};
type PrintProgramProps = {
  enrollmentInfo: EnrollmentDisplayInfo;
};
function Contact({ firstName, lastName, email, phoneNumber, header }: PrintContactProps) {
  return (
    <div className="inline-block">
      <p className="text-xl">{header}</p>
      <p className="font-[Poppins-Bold]">{firstName + " " + lastName}</p>
      <p>{email}</p>
      <p>{phoneNumber}</p>
    </div>
  );
}

function Program({ enrollmentInfo }: PrintProgramProps) {
  const regular = enrollmentInfo.type === "regular";
  return (
    <div className="inline-block">
      <div className="font-[Poppins-Bold]">{enrollmentInfo.name}</div>
      <div>{enrollmentInfo.abbreviation}</div>
      <div> Status: {enrollmentInfo.status}</div>
      <div>Start Date: {formatDate(enrollmentInfo.startDate)}</div>
      <div>End Date: {formatDate(enrollmentInfo.renewalDate)}</div>
      <div>Authorization Code: {enrollmentInfo.authNumber} </div>
      {regular && (
        <div>
          Session Time:
          {" " +
            enrollmentInfo.sessionTime.start_time +
            " - " +
            enrollmentInfo.sessionTime.end_time}
        </div>
      )}
      {regular && <div className="">Days of the Week: {enrollmentInfo.schedule.join(", ")}</div>}
    </div>
  );
}

function formatDate(d: Date) {
  const date = new Date(d);
  return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
}

export default function StudentProfilePrintComponent({
  data,
  contentRef,
  enrollments,
}: PrintComponentProps) {
  return (
    <div>
      <div className="space-b-4 m-12 columns-2" ref={contentRef}>
        <Contact {...data.student} header="Student" />
        <Contact {...data.emergency} header="Emergency Contact" />
        <Contact {...data.serviceCoordinator} header="Service Coordinator" />
        <div className="inline-block">
          <div className="font-[Poppins-Bold]">Student Background:</div>
          <div className="font-[Poppins]">Address: {data.location}</div>
          <div className="font-[Poppins]">Birthdate: {formatDate(data.birthday)}</div>
          <div className="font-[Poppins-Bold]">Student Information:</div>
          <div className="font-[Poppins]">Intake Date: {formatDate(data.intakeDate)}</div>
          <div className="font-[Poppins]">Tour Date: {formatDate(data.tourDate)}</div>
          <div className="font-[Poppins-Bold]">Medication & Medical</div>
          <div className="font-[Poppins]">Dietary Restrictions:</div>
          <div className="font-[Poppins]">
            {data.dietary.map((value) => (
              <li key={value}>{value}</li>
            ))}
          </div>
          <div className="font-[Poppins]">Medication: {data.medication}</div>
        </div>
        <div className="inline-block">
          <div className="text-xl">Regular Programs</div>
          {enrollments.map((value, index) => {
            if (value.type === "regular") {
              return <Program enrollmentInfo={value} key={"printregular" + index} />;
            }
            return <></>;
          })}
        </div>
        <div className="inline-block">
          <div className="text-xl">Varying Programs</div>
          {enrollments.map((value, index) => {
            if (value.type === "varying") {
              return <Program enrollmentInfo={value} key={"printvarying" + index} />;
            }
            return <></>;
          })}
        </div>
      </div>
    </div>
  );
}
