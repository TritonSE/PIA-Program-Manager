/* eslint-disable @typescript-eslint/no-misused-promises */
/**
 * Functions that process task route requests.
 */

import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import mongoose, { HydratedDocument } from "mongoose";

import EnrollmentModel from "../models/enrollment";
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
