import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import SessionModel from "../models/session";
import validationErrorParser from "../util/validationErrorParser";

type StudentInfo = {
  studentId: string;
  attended: boolean;
  hoursAttended: number;
};

export type SessionUpdateBody = {
  _id: string;
  programId: string;
  students: StudentInfo[];
};

export type AbsenceCreateBody = {
  _id: string;
  programId: string;
  date: Date;
  students: StudentInfo[];
};

// Call when creating a session from absence
export const createAbsenceSession: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    validationErrorParser(errors);

    const sessionData = req.body as AbsenceCreateBody;

    const programForm = await SessionModel.findOneAndUpdate(
      { date: sessionData.date, programId: sessionData.programId },
      sessionData,
      { upsert: true, new: true },
    );

    res.status(201).json(programForm);
  } catch (error) {
    next(error);
  }
};

// Call when attendance is marked
export const updateSession: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    validationErrorParser(errors);

    const programData = req.body as SessionUpdateBody;

    const editedProgram = await SessionModel.findOneAndUpdate(
      { _id: programData._id },
      programData,
      {
        new: true,
      },
    );

    if (!editedProgram) {
      return res.status(404).json({ message: "No object in database with provided ID" });
    }

    res.status(200).json(editedProgram);
  } catch (error) {
    next(error);
  }
};

// Call when frontpage to load recent sessions is called
export const getRecentSessions: RequestHandler = async (req, res, next) => {
  try {
    // Change this to return "recent" sessions
    const sessions = await SessionModel.find();

    res.status(200).json(sessions);
  } catch (error) {
    next(error);
  }
};
