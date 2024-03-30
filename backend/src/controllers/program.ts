/* eslint-disable @typescript-eslint/no-misused-promises */
import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import ProgramModel from "../models/program";
import validationErrorParser from "../util/validationErrorParser";

export type Program = {
  name: string;
  abbreviation: string;
  type: string;
  daysOfWeek: string[];
  startDate: string;
  endDate: string;
  color: string; //colorValueHex;
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

export const getAllPrograms: RequestHandler = async (_, res, next) => {
  try {
    const programs = await ProgramModel.find();

    res.status(200).json(programs);
  } catch (error) {
    next(error);
  }
};
