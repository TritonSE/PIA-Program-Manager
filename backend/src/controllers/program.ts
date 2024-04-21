/* eslint-disable @typescript-eslint/no-misused-promises */
import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { Schema } from "mongoose";
//import { error } from "firebase-functions/logger";

import ProgramModel from "../models/program";
import SessionModel from "../models/session";
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

function getDatesBetween(start: Date, end: Date, daysOfWeek: string[]): Date[] {
  const datesBetween: Date[] = [];
  let currentDate = new Date(start);

  while (currentDate <= end) {
    const dayOfWeek = currentDate.getDay();
    const abbreviatedDay = ["SU", "M", "T", "W", "TH", "F", "S"][dayOfWeek];
    if (daysOfWeek.includes(abbreviatedDay)) {
      datesBetween.push(new Date(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return datesBetween;
}

export const createProgram: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    validationErrorParser(errors);

    const programInfo = req.body as Program;

    const programForm = await ProgramModel.create(programInfo);

    const defaultStudentBody = programInfo.studentUIDs.map((studentId) => ({
      studentId: studentId.toString(),
      attended: false,
      hoursAttended: 0,
    }));

    let createdSessions = []

    for (const date of getDatesBetween(
      programInfo.startDate,
      programInfo.endDate,
      programInfo.daysOfWeek,
    )) {
      const newSession = {programId: programForm.id, date: date, students: defaultStudentBody};
      createdSessions.push(SessionModel.create(newSession);
    }

    await Promise.all(createdSessions);

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
