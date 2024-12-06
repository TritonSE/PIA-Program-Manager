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

    const newStudentId = new mongoose.Types.ObjectId();

    const { enrollments, ...studentData } = req.body as StudentRequest;

    // create enrollments for the student
    const createdEnrollments = await Promise.all(
      enrollments.map(async (program: Enrollment) => {
        return await EnrollmentModel.create({ ...program, studentId: newStudentId });
      }),
    );

    const newStudent = await StudentModel.create({
      ...studentData,
      enrollments: createdEnrollments.map((enrollment) => enrollment._id),
    });

    const populatedStudent = await StudentModel.findById(newStudent._id).populate("enrollments");

    res.status(201).json(populatedStudent);
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

    if (!enrollments) {
      const updatedStudent = await StudentModel.findByIdAndUpdate(
        studentId,
        { ...studentData },
        {
          new: true,
        },
      );
      if (!updatedStudent) {
        return res.status(404).json({ message: "Student not found" });
      }

      return res.status(200).json(updatedStudent);
    }

    // update enrollments for the student
    const updatedEnrollments = await Promise.all(
      enrollments.map(async (enrollment: Enrollment) => {
        const enrollmentExists = await EnrollmentModel.findById(enrollment._id);
        const enrollmentBody = { ...enrollment, studentId: new mongoose.Types.ObjectId(studentId) };
        if (!enrollmentExists) {
          return await createEnrollment(enrollmentBody);
        } else {
          return await editEnrollment(enrollmentBody);
        }
      }),
    );

    const updatedStudent = await StudentModel.findByIdAndUpdate(
      studentId,
      { ...studentData, enrollments: updatedEnrollments.map((enrollment) => enrollment?._id) },
      {
        new: true,
      },
    );
    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    const populatedStudent = await StudentModel.findById(updatedStudent._id).populate(
      "enrollments",
    );

    console.log({ populatedStudent });

    res.status(200).json(populatedStudent);
  } catch (error) {
    next(error);
  }
};

export const getAllStudents: RequestHandler = async (_, res, next) => {
  try {
    const students = await StudentModel.find().populate("enrollments");

    res.status(200).json(students);
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

    res.status(200).json({ ...studentData.toObject(), enrollments });
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