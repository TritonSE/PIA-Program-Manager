/* eslint-disable @typescript-eslint/no-misused-promises */
import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Schema } from "mongoose";
// import { error } from "firebase-functions/logger";

import ProgramModel from "../models/program";
import validationErrorParser from "../util/validationErrorParser";

export type Program = {
  _id: string;
  name: string;
  abbreviation: string;
  type: string;
  daysOfWeek: string[];
  startDate: Date;
  endDate: Date;
  color: string; //colorValueHex;
  studentUIDs: Schema.Types.ObjectId[];
  renewalDate: Date;
  hourlyPay: string;
  sessions: [string[]];
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

    const editedProgram = await ProgramModel.findOneAndUpdate({ _id: programId }, programData, {
      new: true,
    });

    if (!editedProgram) {
      return res.status(404).json({ message: "No object in database with provided ID" });
    }

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

export const getAllPrograms: RequestHandler = async (req, res, next) => {
  try {
    const programs = await ProgramModel.find();

    res.status(200).json(programs);
  } catch (error) {
    next(error);
  }
};
