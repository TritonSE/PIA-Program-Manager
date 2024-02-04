/* eslint-disable @typescript-eslint/no-misused-promises */
/**
 * Functions that process task route requests.
 */

import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import { ValidationError } from "../errors/validation";
import StudentModel from "../models/student";

export type contact = {
  lastName: string;
  firstName: string;
  email: string;
  phoneNumber: string;
};

export type typedModel = {
  student: contact;
  emergency: contact;
  serviceCoordinator: contact;
  location: string;
  medication: string;
  birthday: string;
  intakeDate: string;
  tourDate: string;
  prog1: string;
  prog2: string;
  dietary: string;
  otherString: string;
};

export const createStudent: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      let errorString = "";

      for (const error of errors.array()) {
        errorString += error.msg + " ";
      }
      throw new ValidationError(errorString);
    }

    const newStudent = await StudentModel.create(req.body as typedModel);

    res.status(201).json(newStudent);
  } catch (error) {
    next(error);
  }
};
