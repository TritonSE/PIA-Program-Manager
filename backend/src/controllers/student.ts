/* eslint-disable @typescript-eslint/no-misused-promises */
/**
 * Functions that process task route requests.
 */

import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import mongoose, { HydratedDocument } from "mongoose";

import EnrollmentModel from "../models/enrollment";
import { Image } from "../models/image";
import ProgressNoteModel from "../models/progressNote";
import StudentModel from "../models/student";
import { Enrollment } from "../types/enrollment";
import { createEnrollment, editEnrollment } from "../util/enrollment";
import validationErrorParser from "../util/validationErrorParser";

type Student = HydratedDocument<typeof StudentModel>;
type StudentRequest = Student & { enrollments: Enrollment[] };

export const createStudent: RequestHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    validationErrorParser(errors);

    const { enrollments, ...studentData } = req.body as StudentRequest;
    const newStudent = await StudentModel.create(studentData);
    // create enrollments for the student
    await Promise.all(
      enrollments.map(async (program: Enrollment) => {
        await createEnrollment({ ...program, studentId: newStudent._id });
      }),
    );

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
    const { enrollments, ...studentData } = req.body as StudentRequest;

    if (studentId !== studentData._id.toString()) {
      return res.status(400).json({ message: "Invalid student ID" });
    }
    const updatedStudent = await StudentModel.findByIdAndUpdate(studentId, studentData, {
      new: true,
    });
    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    // update enrollments for the student
    await Promise.all(
      enrollments.map(async (enrollment: Enrollment) => {
        const enrollmentExists = await EnrollmentModel.findById(enrollment._id);
        const enrollmentBody = { ...enrollment, studentId: new mongoose.Types.ObjectId(studentId) };
        if (!enrollmentExists) await createEnrollment(enrollmentBody);
        else await editEnrollment(enrollmentBody);
      }),
    );

    res.status(200).json({ ...updatedStudent, enrollments });
  } catch (error) {
    next(error);
  }
};

export const getAllStudents: RequestHandler = async (_, res, next) => {
  try {
    const students = await StudentModel.find();

    // gather all enrollments for each student and put them in student.programs
    const hydratedStudents = await Promise.all(
      students.map(async (student) => {
        const enrollments = await EnrollmentModel.find({ studentId: student._id });
        return { ...student.toObject(), programs: enrollments };
      }),
    );

    res.status(200).json(hydratedStudents);
  } catch (error) {
    next(error);
  }
};

export const getStudent: RequestHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    validationErrorParser(errors);

    const studentId = req.params.id;
    const studentData = await StudentModel.findById(req.params.id);

    if (!studentData) {
      return res.status(404).json({ message: "Student not found" });
    }

    const enrollments = await EnrollmentModel.find({ studentId });

    res.status(200).json({ ...studentData.toObject(), programs: enrollments });
  } catch (error) {
    next(error);
  }
};

export const deleteStudent: RequestHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationErrorParser(errors);

    const studentId = req.params.id;
    const deletedStudent = await StudentModel.findById(studentId);
    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    await EnrollmentModel.deleteMany({ studentId });
    await ProgressNoteModel.deleteMany({ studentId });
    await Image.deleteMany({ userId: studentId });
    await StudentModel.deleteOne({ _id: studentId });

    res.status(200).json(deletedStudent);
  } catch (error) {
    next(error);
  }
};
