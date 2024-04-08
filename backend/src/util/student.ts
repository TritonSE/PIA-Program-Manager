import mongoose from "mongoose";

import ProgramFormModel from "../models/program-form";
import { programLink } from "../types/programLink";

type ObjectId = mongoose.Types.ObjectId;

export const programValidatorUtil = (programs: programLink[]) => {
  const allowedStatuses = ["Joined", "Waitlisted", "Archived", "Not a fit"];
  const programIds = new Set();
  programs.forEach((program) => {
    programIds.add(program.programId);
    if (!mongoose.Types.ObjectId.isValid(program.programId)) {
      throw new Error("Program ID format is invalid");
    }
    if (!allowedStatuses.includes(program.status)) {
      throw new Error("Status must be one of: " + allowedStatuses.join(", "));
    }
  });
  if (programIds.size !== programs.length) {
    throw new Error("Programs must be unique");
  }
  return true;
};

export const addStudentToPrograms = async (studentId: ObjectId, programIds: ObjectId[]) => {
  await Promise.all(
    programIds.map(async (programId) => {
      await ProgramFormModel.findByIdAndUpdate(
        programId,
        { $push: { students: studentId } },
        { new: true },
      );
    }),
  );
};

export const removeStudentFromPrograms = async (studentId: ObjectId, programIds: ObjectId[]) => {
  await Promise.all(
    programIds.map(async (programId) => {
      await ProgramFormModel.findByIdAndUpdate(
        programId,
        { $pull: { students: studentId } },
        { new: true },
      );
    }),
  );
};
