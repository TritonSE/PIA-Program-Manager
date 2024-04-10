/* eslint-disable @typescript-eslint/no-misused-promises */
/**
 * Functions that process task route requests.
 */

import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import StudentModel from "../models/student";
import { programLink } from "../types/programLink";
import { addStudentToPrograms, removeStudentFromPrograms } from "../util/student";
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
  programs: programLink[];
  dietary: string[];
  otherString: string;
};

type Contact = {
  lastName: string;
  firstName: string;
  email: string;
  phoneNumber: string;
};

type Student = {
  _id: string;
  student: Contact;
  emergency: Contact;
  serviceCoordinator: Contact;
  location: string;
  medication?: string;
  birthday: Date;
  intakeDate: Date;
  tourDate: Date;
  programs: programLink[];
  dietary: string[];
  otherString?: string;
};

export const createStudent: RequestHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    validationErrorParser(errors);

    const newStudent = await StudentModel.create(req.body as typedModel);
    const programIds = newStudent.programs.map((programObj: programLink) => programObj.programId);
    await addStudentToPrograms(newStudent._id, programIds);

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
    const studentData = req.body as Student;

    if (studentId !== studentData._id) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const prevStudent = await StudentModel.findById(studentId);
    const editedStudent = await StudentModel.findOneAndUpdate({ _id: studentId }, studentData, {
      new: true,
    });

    if (!prevStudent || !editedStudent) {
      return res.status(404).json({ message: "No object in database with provided ID" });
    }

    // remove student from possibly stale programs
    const prevProgramIds = prevStudent.programs.map(
      (programObj: programLink) => programObj.programId,
    );
    await removeStudentFromPrograms(prevStudent._id, prevProgramIds);

    // add student to new programs
    const newProgramIds = editedStudent.programs.map(
      (programObj: programLink) => programObj.programId,
    );
    await addStudentToPrograms(editedStudent._id, newProgramIds);

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

export const deleteAllStudents: RequestHandler = async (_, res, next) => {
  try {
    // remove students from all programs
    const students = await StudentModel.find();
    await Promise.all(
      students.map(async (student) => {
        const programIds = student.programs.map((programObj: programLink) => programObj.programId);
        await removeStudentFromPrograms(student._id, programIds);
      }),
    );

    await StudentModel.deleteMany();

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
