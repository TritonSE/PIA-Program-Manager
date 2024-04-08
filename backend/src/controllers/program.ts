/* eslint-disable @typescript-eslint/no-misused-promises */
import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import ProgramFormModel from "../models/program-form";
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

export const createForm: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    validationErrorParser(errors);

    const programForm = await ProgramFormModel.create(req.body as Program);

    res.status(201).json(programForm);
  } catch (error) {
    next(error);
  }
};

export const getAllPrograms: RequestHandler = async (req, res, next) => {
  try {
    const programs = await ProgramFormModel.find();

    res.status(200).json(programs);
  } catch (error) {
    next(error);
  }
}
