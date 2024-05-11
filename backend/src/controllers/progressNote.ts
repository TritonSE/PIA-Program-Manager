import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

import { ValidationError } from "../errors";
import ProgressNote from "../models/progressNote";
import StudentModel from "../models/student";
import UserModel from "../models/user";
import validationErrorParser from "../util/validationErrorParser";

import {
  CreateProgressNoteRequestBody,
  DeleteProgressNoteRequestBody,
  EditProgressNoteRequestBody,
  ExistingProgressNoteType,
  ProgressNoteType,
} from "./types/progressNoteTypes";
import { LoginUserRequestBody } from "./types/userTypes";

export const createProgressNote = async (
  req: Request<Record<string, never>, Record<string, never>, CreateProgressNoteRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { uid, studentId } = req.body;

    const user = await UserModel.findById(uid);
    if (!user) {
      throw ValidationError.USER_NOT_FOUND;
    }

    const student = await StudentModel.findById(studentId);
    if (!student) {
      throw ValidationError.STUDENT_NOT_FOUND;
    }

    const errors = validationResult(req);
    validationErrorParser(errors);

    const newProgressNote = {
      ...req.body,
      lastEditedBy: user.name,
      userId: uid,
    } as ProgressNoteType;

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

export const editProgressNote = async (
  req: Request<Record<string, never>, Record<string, never>, EditProgressNoteRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { uid } = req.body;

    const user = await UserModel.findById(uid);
    if (!user) {
      throw ValidationError.USER_NOT_FOUND;
    }

    if (user.accountType !== "admin") {
      throw ValidationError.UNAUTHORIZED_USER;
    }

    const errors = validationResult(req);
    validationErrorParser(errors);

    const newProgressNote = {
      ...req.body,
      lastEditedBy: user.name,
      userId: uid,
    } as ExistingProgressNoteType;

    const editedProgressNote = await ProgressNote.findOneAndUpdate(
      { _id: newProgressNote._id },
      newProgressNote,
      { new: true }, //returns updated document
    );

    if (!editedProgressNote) {
      throw ValidationError.PROGRESS_NOTE_NOT_FOUND;
    }

    res.status(200).json(editedProgressNote);
  } catch (error) {
    next(error);
  }
};

export const deleteProgressNote = async (
  req: Request<Record<string, never>, Record<string, never>, DeleteProgressNoteRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { noteId, studentId, uid } = req.body;

    const user = await UserModel.findById(uid);
    if (!user) {
      throw ValidationError.USER_NOT_FOUND;
    }

    if (user.accountType !== "admin") {
      throw ValidationError.UNAUTHORIZED_USER;
    }

    const errors = validationResult(req);
    validationErrorParser(errors);

    const deletedProgressNote = await ProgressNote.findOneAndDelete({ _id: noteId });

    if (!deletedProgressNote) {
      throw ValidationError.PROGRESS_NOTE_NOT_FOUND;
    }

    const student = await StudentModel.findOneAndUpdate(
      { _id: studentId },
      { $pull: { progressNotes: noteId } },
    );

    if (!student) {
      throw ValidationError.STUDENT_NOT_FOUND;
    }

    res.status(200).json(deletedProgressNote);
  } catch (error) {
    next(error);
  }
};

export const getAllProgressNotes = async (
  req: Request<Record<string, never>, Record<string, never>, LoginUserRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { uid } = req.body;
    const user = await UserModel.findById(uid);
    if (!user) {
      throw ValidationError.USER_NOT_FOUND;
    }

    const allNotes = await ProgressNote.find();

    res.status(200).json(allNotes);
  } catch (error) {
    next(error);
  }
};
