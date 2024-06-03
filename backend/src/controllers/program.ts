/* eslint-disable @typescript-eslint/no-misused-promises */
import { RequestHandler } from "express";
import { validationResult } from "express-validator";
//import { error } from "firebase-functions/logger";

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
  sessions: { start_time: string; end_time: string }[];
};

export const createProgram: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    validationErrorParser(errors);
    const programInfo = req.body as Program;

    const programForm = await ProgramModel.create(programInfo);

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

export const getAllPrograms: RequestHandler = async (req, res, next) => {
  try {
    const programs = await ProgramModel.find();

    res.status(200).json(programs);
  } catch (error) {
    next(error);
  }
};
