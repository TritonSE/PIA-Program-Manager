/* eslint-disable @typescript-eslint/no-misused-promises */
import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import { ValidationError } from "../errors/validation";
import ProgramFormModel from "../models/program-form";

export type typeProgramForm = {
  name: string;
  abbreviation: string;
  type: string;
  startDate: string;
  endDate: string;
  color: string; //colorValueHex;
};

export const createForm: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    //validationErrorParser(errors);

    if (!errors.isEmpty()) {
      let errorString = "";

      for (const error of errors.array()) {
        errorString += error.msg + " ";
      }
      throw new ValidationError(errorString);
    }

    const programForm = await ProgramFormModel.create(req.body as typeProgramForm);

    res.status(201).json(programForm);
  } catch (error) {
    next(error);
  }
};
