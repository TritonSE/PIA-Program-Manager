import mongoose from "mongoose";

import ProgramModel from "../models/program";
import { Enrollment } from "../types/enrollment";

export const programValidatorUtil = async (enrollments: Enrollment[]) => {
  // verify all fields are present
  const requiredFields = [
    "programId",
    "status",
    "hoursLeft",
    "schedule",
    "startDate",
    "renewalDate",
    "authNumber",
  ];

  enrollments.forEach((enrollment: Enrollment) => {
    requiredFields.forEach((field) => {
      // Can't just test for truthiness because 0 is a valid value for hoursLeft
      if (
        enrollment[field as keyof Enrollment] === undefined ||
        enrollment[field as keyof Enrollment] === null
      )
        throw new Error(`Field ${field} is required on enrollment`);
    });
  });

  // verify statuses are correct and student is not in more than 2 programs
  const allowedStatuses = ["Joined", "Waitlisted", "Archived", "Not a fit", "Completed"];
  const programIds = new Set();
  let active = 0;
  let varying = 0;
  await Promise.all(
    enrollments.map(async (enrollment) => {
      programIds.add(enrollment.programId);
      if (!mongoose.Types.ObjectId.isValid(enrollment.programId))
        throw new Error("Program ID format is invalid");

      if (!allowedStatuses.includes(enrollment.status))
        throw new Error("Status must be one of: " + allowedStatuses.join(", "));

      const programType = (await ProgramModel.findById(enrollment.programId))?.type;
      if (enrollment.status === "Joined") {
        active++;
        if (programType === "varying") varying++;
      }
    }),
  );

  // handle error reporting
  if (programIds.size !== enrollments.length) throw new Error("Programs must be unique");
  if (active > 2) throw new Error("Student can only be active in 2 programs");
  if (varying > 1) throw new Error("Student can only be in 1 varying program");

  return true;
};
