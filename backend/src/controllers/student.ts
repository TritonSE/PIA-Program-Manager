/* eslint-disable @typescript-eslint/no-misused-promises */
/**
 * Functions that process task route requests.
 */

import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import StudentModel from "../models/student";
import validationErrorParser from "../util/validationErrorParser";

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
  prog1: string[];
  prog2: string[];
  dietary: string[];
  otherString: string;
};

export const createStudent: RequestHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    validationErrorParser(errors);

    const newStudent = await StudentModel.create(req.body as typedModel);

    res.status(201).json(newStudent);
  } catch (error) {
    next(error);
  }
};
