import mongoose from "mongoose";

import { Student, typedModel } from "../controllers/student";
import ProgramModel from "../models/program";
import { programLink } from "../types/programLink";

type ObjectId = mongoose.Types.ObjectId;

export const programValidatorUtil = async (programs: programLink[]) => {
  const allowedStatuses = ["Joined", "Waitlisted", "Archived", "Not a fit"];
  const programIds = new Set();
  let active = 0;
  let varying = 0;
  await Promise.all(
    programs.map(async (program) => {
      programIds.add(program.programId);
      if (!mongoose.Types.ObjectId.isValid(program.programId))
        throw new Error("Program ID format is invalid");

      if (!allowedStatuses.includes(program.status))
        throw new Error("Status must be one of: " + allowedStatuses.join(", "));

      const programType = (await ProgramModel.findById(program.programId))?.type;
      if (program.status === "Joined") {
        active++;
        if (programType === "varying") varying++;
      }
    }),
  );
  if (programIds.size !== programs.length) throw new Error("Programs must be unique");
  if (active > 2) throw new Error("Student can only be active in 2 programs");
  if (varying > 1) throw new Error("Student can only be in 1 varying program");

  return true;
};

export const addStudentToPrograms = async (studentId: ObjectId, programIds: ObjectId[]) => {
  await Promise.all(
    programIds.map(async (programId) => {
      await ProgramModel.findByIdAndUpdate(
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
      await ProgramModel.findByIdAndUpdate(
        programId,
        { $pull: { students: studentId } },
        { new: true },
      );
    }),
  );
};

export const checkProgramStatus = async (
  newStudentData: typedModel | Student,
  programIds: ObjectId[],
) => {
  const programs = await ProgramModel.find({ _id: { $in: programIds }, archived: true });

  const updatedStudentData = {
    ...newStudentData,
    programs: newStudentData.programs.map((program: programLink) => {
      if (programs.find((archivedProgram) => archivedProgram._id.equals(program.programId)))
        return { ...program, status: "Archived" } as programLink;
      return program;
    }),
  };

  return updatedStudentData;
};
