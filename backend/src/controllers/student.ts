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
  regularPrograms: string[];
  varyingPrograms: string[];
  dietary: string[];
  otherString: string;
};

type Contact = {
  lastName: string;
  firstName: string;
  email: string;
  phoneNumber: string;
};

type StudentJSON = {
  _id: string;
  student: Contact;
  emergency: Contact;
  serviceCoordinator: Contact;
  location: string;
  medication?: string;
  birthday: Date;
  intakeDate: Date;
  tourDate: Date;
  regularPrograms: string[];
  varyingPrograms: string[];
  dietary: string[];
  otherString?: string;
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

export const editStudent: RequestHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    validationErrorParser(errors);

    const studentId = req.params.id;
    const studentData = req.body as StudentJSON;

    if (studentId !== studentData._id) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const editedStudent = await StudentModel.findOneAndUpdate({ _id: studentId }, studentData, {
      new: true,
    });

    if (!editedStudent) {
      return res.status(404).json({ message: "No object in database with provided ID" });
    }

    res.status(200).json(editedStudent);
  } catch (error) {
    next(error);
  }
};

export const getAllStudents: RequestHandler = async (_, res, next) => {
  try {
    const students = await StudentModel.find();

    res.status(200).json(students);
  } catch (error) {
    next(error);
  }
};
