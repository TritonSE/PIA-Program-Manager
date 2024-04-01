/* eslint-disable @typescript-eslint/no-misused-promises */
import { RequestHandler } from "express";
import { validationResult } from "express-validator";
//import { error } from "firebase-functions/logger";

import ProgramFormModel from "../models/program-form";
import validationErrorParser from "../util/validationErrorParser";

export type Program = {
  _id: string;
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

export const updateForm: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    validationErrorParser(errors);

    const programId = req.params.id;
    const programData = req.body as Program;

    if (programId !== programData._id) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const editedProgram = await ProgramFormModel.findOneAndUpdate({ _id: programId }, programData, {
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
