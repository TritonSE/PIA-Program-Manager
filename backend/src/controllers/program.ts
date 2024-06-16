/* eslint-disable @typescript-eslint/no-misused-promises */
import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
// import { error } from "firebase-functions/logger";

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
  archived: boolean;
};

export type ExistingProgram = Program & {
  dateUpdated: string;
};

export const createProgram: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    validationErrorParser(errors);

    const programForm = await ProgramModel.create({
      ...(req.body as Program),
      dateUpdated: new Date().toISOString(),
    });

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
    const programData = req.body as ExistingProgram;

    const editedProgram = await ProgramModel.findOneAndUpdate(
      { _id: programId },
      { ...programData, archived: false, dateUpdated: new Date().toISOString() }, //stand-in method of un-archiving programs
      {
        new: true,
      },
    );

    if (!editedProgram) {
      return res.status(404).json({ message: "No object in database with provided ID" });
    }

    // Waitlist all archived students. Making sure to only waitlist Archived students
    // will prevent enrollments from being updated every time the program is updated
    await EnrollmentModel.updateMany(
      { programId: { $eq: programId }, status: { $eq: "Archived" } },
      { $set: { status: "Waitlisted", dateUpdated: Date.now() } },
    );

    res.status(200).json(editedProgram);
  } catch (error) {
    next(error);
  }
};

export const getProgram: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    const program = await ProgramModel.findById(id);

    if (program === null) {
      throw createHttpError(404, "Program not found");
    }

    res.status(200).json(program);
  } catch (error) {
    next(error);
  }
};

export const archiveProgram: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    validationErrorParser(errors);

    const programId = req.params.id;
    const program = await ProgramModel.findByIdAndUpdate(
      programId,
      { $set: { archived: true, dateUpdated: new Date().toISOString() } },
      { new: true },
    );
    if (!program)
      return res.status(404).json({ message: "Program with this id not found in database" });

    //Archive all students
    await EnrollmentModel.updateMany(
      { programId: { $eq: programId } },
      { $set: { status: "Archived", dateUpdated: Date.now() } },
    );

    return res.status(200).json(program);
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

export const getProgramEnrollments: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    const enrollments = await EnrollmentModel.find({ programId: id });

    res.status(200).json(enrollments);
  } catch (error) {
    next(error);
  }
};
