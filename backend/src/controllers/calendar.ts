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
 * Request handler for getting all possible calendars
 * @param req
 * @param res
 * @param next
 */
// export const getCalendars: RequestHandler = async (req, res, next) => {

// }

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
    const sessions = await SessionModel.find({ programId });

    const calendar: Calendar = { studentId, programId, calendar: [] };
    for (const session of sessions) {
      for (const student of session.students) {
        if (student.studentId.toString() === studentId) {
          let hours = 0;
          if (session.marked) {
            hours = student.hoursAttended;
          }
          const date = session.date;
          const sessionId = session._id.toString();
          calendar.calendar.push({ date, hours, session: sessionId });
        }
      }
    }
    console.log(calendar);

    return res.status(200).send(calendar);
  } catch (error) {
    next(error);
  }
};
