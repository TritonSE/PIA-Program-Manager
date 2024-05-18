/* eslint-disable @typescript-eslint/no-misused-promises */
import { RequestHandler } from "express";
import { validationResult } from "express-validator";
//import { error } from "firebase-functions/logger";

import EnrollmentModel from "../models/enrollment";
import ProgramModel from "../models/program";
import validationErrorParser from "../util/validationErrorParser";

export type Program = {
  _id: string;
  name: string;
  abbreviation: string;
  type: string;
  daysOfWeek: string[];
  color: string; //colorValueHex;
  hourlyPay: string;
  sessions: [string[]];
  archived?: boolean;
};

export const createProgram: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    validationErrorParser(errors);

    const programForm = await ProgramModel.create(req.body as Program);

    res.status(201).json(programForm);
  } catch (error) {
    next(error);
  }
};

export const updateProgram: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    validationErrorParser(errors);

    const programId = req.params.id;
    const programData = req.body as Program;

    const editedProgram = await ProgramModel.findOneAndUpdate(
      { _id: programId },
      { ...programData, archived: false }, //stand-in method of un-archiving programs
      {
        new: true,
      },
    );

    if (!editedProgram) {
      return res.status(404).json({ message: "No object in database with provided ID" });
    }

    // Waitlist all archived students. Making sure to only waitlist Archived students
    // will prevent enrollments from being updated every time the program is updated
    const updateReport = await EnrollmentModel.updateMany(
      { programId: { $eq: programId }, status: { $eq: "Archived" } },
      { $set: { status: "Waitlisted", dateUpdated: Date.now() } },
    );

    res.status(200).json({ ...editedProgram, updateReport });
  } catch (error) {
    next(error);
  }
};

export const archiveProgram: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    validationErrorParser(errors);

    const programId = req.params.id;
    const program = await ProgramModel.findByIdAndUpdate(programId, { $set: { archived: true } });
    if (!program)
      return res.status(404).json({ message: "Program with this id not found in database" });

    //Archive all students
    const updateReport = await EnrollmentModel.updateMany(
      { programId: { $eq: programId } },
      { $set: { status: "Archived", dateUpdated: Date.now() } },
    );

    return res.status(200).json({ ...program, updateReport });
  } catch (error) {
    next(error);
  }
};

export const getAllPrograms: RequestHandler = async (req, res, next) => {
  try {
    const programs = await ProgramModel.find();

    res.status(200).json(programs);
  } catch (error) {
    next(error);
  }
};
