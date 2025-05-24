/* eslint-disable @typescript-eslint/no-misused-promises */
/**
 * Function handlers for calendar route requests
 */
import { RequestHandler } from "express";
import createHttpError from "http-errors";

import EnrollmentModel from "../models/enrollment";
import SessionModel from "../models/session";

import { Calendar } from "./types/calendarTypes";

/**
 * Calendar Body: {
 *
 * studentId: string;
 * programId: string;
 * calendar: {
 *      date: Date;
 *      hours: number;
 *      session: string;
 * }[]
 *
 * }
 */

/**
 * Request handler for getting calendar for student in program
 * @param req
 * @param res
 * @param next
 */
export const getCalendar: RequestHandler = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    const programId = req.params.programId;

    const enrollment = EnrollmentModel.find({ studentId, programId });
    if (!enrollment) {
      throw createHttpError(404, "Enrollment not found");
    }

    // get all sessions with studentId and programId
    const sessions = await SessionModel.find({ programId, marked: true });

    const calendar: Calendar = { studentId, programId, calendar: [] };
    for (const session of sessions) {
      for (const student of session.students) {
        if (student.studentId.toString() === studentId) {
          let hours = 0;
          if (student.hoursAttended !== 0 && student.attended) {
            hours = student.hoursAttended;
          }
          const date = session.date;
          const sessionId = session._id.toString();
          calendar.calendar.push({ date, hours, session: sessionId });
        }
      }
    }

    return res.status(200).send(calendar);
  } catch (error) {
    next(error);
  }
};

/**
 * Handler for editing a day in a calendar
 * @param req
 * @param res
 * @param next
 */
export const editCalendar: RequestHandler = async (req, res, next) => {
  try {
    console.log(req.body);
    const { studentId, programId, calendar } = req.body as Calendar;

    const enrollment = await EnrollmentModel.findOne({ studentId, programId });
    if (!enrollment) {
      throw createHttpError(404, "Enrollment not found");
    }

    await Promise.all(
      calendar.map(async (slot) => {
        const { hours, session } = slot;
        const sessionObject = await SessionModel.findById(session);

        if (!sessionObject) {
          throw createHttpError(404, "Session not found");
        }

        if (sessionObject.programId.toString() !== programId) {
          throw createHttpError(404, "Incorrect program for session");
        }

        const student = sessionObject.students.find((s) => s.studentId.toString() === studentId);

        if (!student) {
          throw createHttpError(404, "Student not in session");
        }

        const prevHoursAttended = student.hoursAttended;
        let hoursLeft = enrollment.hoursLeft + prevHoursAttended;

        student.hoursAttended = hours;
        student.attended = true;
        hoursLeft -= student.hoursAttended;
        enrollment.hoursLeft = hoursLeft > 0 ? hoursLeft : 0;

        await sessionObject.save();
      }),
    );

    await enrollment.save();

    res.status(200).json({ message: "Calendar updated" });
  } catch (error) {
    next(error);
  }
};
