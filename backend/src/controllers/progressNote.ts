/* eslint-disable @typescript-eslint/no-misused-promises */
import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import { ValidationError } from "../errors";
import ProgressNote from "../models/progressNote";
import StudentModel from "../models/student";
import UserModel from "../models/user";
import validationErrorParser from "../util/validationErrorParser";

import { CreateProgressNoteRequestBody, ProgressNoteType } from "./types/progressNoteTypes";
import { UserIdRequest } from "./types/types";

export const createProgressNote: RequestHandler = async (req, res, next) => {
  try {
    const customReq = req as UserIdRequest;
    const userId = customReq.userId;

    const user = await UserModel.findById(userId);
    if (!user) {
      throw ValidationError.USER_NOT_FOUND;
    }

    const { studentId } = customReq.body as CreateProgressNoteRequestBody;

    const student = await StudentModel.findById(studentId);
    if (!student) {
      throw ValidationError.STUDENT_NOT_FOUND;
    }

    const errors = validationResult(req);
    validationErrorParser(errors);

    const newProgressNote = { ...req.body, lastEditedBy: user.name, userId } as ProgressNoteType;

    const createdProgressNote = await ProgressNote.create(newProgressNote);

    // Add the progress note to the student
    await StudentModel.findOneAndUpdate(
      { _id: newProgressNote.studentId },
      { $push: { progressNotes: createdProgressNote._id } },
    );

    res.status(201).json(createdProgressNote);
  } catch (error) {
    next(error);
  }
};

// export const updateProgram: RequestHandler = async (req, res, next) => {
//   const errors = validationResult(req);
//   try {
//     validationErrorParser(errors);

//     const programId = req.params.id;
//     const programData = req.body as Program;

//     const editedProgram = await ProgramModel.findOneAndUpdate({ _id: programId }, programData, {
//       new: true,
//     });

//     if (!editedProgram) {
//       return res.status(404).json({ message: "No object in database with provided ID" });
//     }

//     res.status(200).json(editedProgram);
//   } catch (error) {
//     next(error);
//   }
// };

export const getAllProgressNotes: RequestHandler = async (req, res, next) => {
  try {
    const customReq = req as UserIdRequest;
    const userId = customReq.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      throw ValidationError.USER_NOT_FOUND;
    }

    const allNotes = await ProgressNote.find();

    res.status(200).json(allNotes);
  } catch (error) {
    next(error);
  }
};
