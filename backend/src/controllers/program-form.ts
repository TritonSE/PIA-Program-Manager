/* eslint-disable @typescript-eslint/no-misused-promises */
/**
 * Functions that process task route requests.
 */

import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import { ValidationError } from "../errors/validation";
import ProgramModel from "../models/program-form";

export type typedModel = {
  name: string;
  abbreviation: string;
  type: string;
  startDate: string;
  endDate: string;
  color: string;
};

export const createProgram: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      let errorString = "";

      for (const error of errors.array()) {
        errorString += error.msg + " ";
      }
      throw new ValidationError(errorString);
    }

    const newProgram = await ProgramModel.create(req.body as typedModel);

    res.status(201).json(newProgram);
  } catch (error) {
    next(error);
  }
};
