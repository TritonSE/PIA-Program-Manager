/* eslint-disable @typescript-eslint/no-misused-promises */
/**
 * Functions that process task route requests.
 */

import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import { CustomError } from "../errors/errors";
import { errorHandler } from "../errors/handler";
import StudentModel from "../models/student";

export const createStudent: RequestHandler = async (req, res, next) => {
  type contact = {
    lastName: string;
    firstName: string;
    email: string;
    phoneNumber: string;
  };

  type typedModel = {
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

  const errors = validationResult(req);

  const {
    student,
    emergency,
    serviceCoordinator,
    location,
    medication,
    birthday,
    intakeDate,
    tourDate,
    prog1,
    prog2,
    dietary,
    otherString,
  }: typedModel = req.body as typedModel; // ?????????

  try {
    let errornum = 0;
    for (const error of errors.array()) {
      errorHandler(new CustomError(errornum++, 400, error.msg as string), req, res);
    }

    const newStudent = await StudentModel.create({
      student,
      emergency,
      serviceCoordinator,
      location,
      medication,
      birthday,
      intakeDate,
      tourDate,
      prog1,
      prog2,
      dietary,
      otherString,
    });

    res.status(201).json(newStudent);
  } catch (error) {
    next(error);
  }
};
