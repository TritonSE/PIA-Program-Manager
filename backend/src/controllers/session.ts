import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import mongoose from "mongoose";

import AbsenceSessionModel from "../models/absenceSession";
import EnrollmentModel from "../models/enrollment";
import ProgramModel from "../models/program";
import SessionModel from "../models/session";
import validationErrorParser from "../util/validationErrorParser";

type StudentInfo = {
  studentId: mongoose.Types.ObjectId;
  attended: boolean;
  hoursAttended: number;
};

type Program = {
  _id: mongoose.Types.ObjectId;
  name: string;
  abbreviation: string;
  type: string;
  daysOfWeek: string[];
  color: string; //colorValueHex;
  hourlyPay: number;
  sessions: { start_time: string; end_time: string }[];
};

export type UpdateSessionBody = {
  _id: string;
  programId: string;
  sessionTime: { start_time: string; end_time: string };
  students: StudentInfo[];
};

export type SessionBody = {
  programId: mongoose.Types.ObjectId;
  sessionTime: { start_time: string; end_time: string };
  students: StudentInfo[];
  marked: boolean;
  date: Date;
  isAbsenceSession: boolean;
};

export type AbsenceCreateBody = {
  programId: string;
  date: Date;
  student: StudentInfo;
};

// Gets the dates for the given days of the week since the start date
function getSessionsSince(start: Date, daysOfWeek: string[]): Date[] {
  function setToMidnight(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  if (start.getFullYear() === new Date(0).getFullYear()) {
    const futureDate = setToMidnight(new Date());
    while (true) {
      const dayOfWeek = futureDate.getUTCDay();
      const abbreviatedDay = ["Su", "M", "T", "W", "Th", "F", "Sa"][dayOfWeek];
      if (daysOfWeek.includes(abbreviatedDay)) {
        return [futureDate];
      }
      futureDate.setDate(futureDate.getDate() + 1);
    }
  }

  const datesBetween: Date[] = [];
  const currentDate = setToMidnight(new Date(start));
  while (currentDate <= new Date()) {
    const dayOfWeek = currentDate.getUTCDay();
    const abbreviatedDay = ["Su", "M", "T", "W", "Th", "F", "Sa"][dayOfWeek];
    if (currentDate.getDate() !== start.getDate() && daysOfWeek.includes(abbreviatedDay)) {
      datesBetween.push(new Date(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return datesBetween;
}

// Gets the number of hours for a particular session (rounded up)
const hoursAttended = (start_time: string, end_time: string) => {
  const [startHour, startMinute] = start_time.split(":").map(Number);
  const [endHour, endMinute] = end_time.split(":").map(Number);
  return endHour - startHour + (endMinute - startMinute >= 30 ? 1 : 0);
};

// Dynamically creates any regular sessions since the last created session, or today
const createMissingRegularSessions = async () => {
  const programs = await ProgramModel.find({ type: "regular" }).lean().exec();
  const programPromises = programs.map(async (program: Program) => {
    // Find the most recent session for the given program
    const mostRecentSession = await SessionModel.findOne({
      programId: program._id,
      isAbsenceSession: false,
    })
      .sort({ date: -1 })
      .exec();

    // Get all dates since the last session
    let dates;
    if (mostRecentSession !== undefined && mostRecentSession !== null) {
      dates = getSessionsSince(mostRecentSession.date, program.daysOfWeek);
    } else {
      dates = getSessionsSince(new Date(0), program.daysOfWeek);
    }
    const sessionPromises = dates.map(async (date) => {
      const dayOfWeek = ["Su", "M", "T", "W", "Th", "F", "Sa"][date.getUTCDay()];
      const newSessions = await Promise.all(
        program.sessions.map(async (session) => {
          // Get all students who are enrolled in this particular session
          const enrollments = await EnrollmentModel.find({
            "sessionTime.start_time": session.start_time,
            "sessionTime.end_time": session.end_time,
            schedule: dayOfWeek,
            startDate: { $lte: new Date(date) },
            programId: program._id,
          });
          if (enrollments.length === 0) {
            return null;
          }

          // Create default values for the new session
          const studentsInfo: StudentInfo[] = enrollments.map((enrollment) => ({
            studentId: enrollment.studentId,
            attended: true,
            hoursAttended: hoursAttended(session.start_time, session.end_time),
          }));
          const newSession: SessionBody = {
            programId: program._id,
            sessionTime: session,
            students: studentsInfo,
            marked: false,
            isAbsenceSession: false,
            date,
          };

          return newSession;
        }),
      );
      return SessionModel.create(newSessions.filter((session) => session !== null));
    });
    await Promise.all(sessionPromises);
  });
  await Promise.all(programPromises);
};

// Dynamically creates any varying sessions since the last created session, or today
const createMissingVaryingSessions = async () => {
  // Get all varying program
  const programs = await ProgramModel.find({ type: "varying" }).lean().exec();
  const programPromises = programs.map(async (program: Program) => {
    // Find most recent session and generate from there
    const mostRecentSession = await SessionModel.findOne({
      programId: program._id,
      isAbsenceSession: false,
    })
      .sort({ date: -1 })
      .exec();

    let mostRecentDate = new Date();
    if (mostRecentSession !== undefined && mostRecentSession !== null) {
      mostRecentDate = mostRecentSession.date;
    }

    // Get all enrollments belonging to this varying program
    const enrollments = await EnrollmentModel.find({
      programId: program._id,
      startDate: { $lte: mostRecentDate },
      renewalDate: { $gte: mostRecentDate },
    })
      .lean()
      .exec();
    if (enrollments.length === 0) {
      return;
    }

    const allDays = new Set<string>();
    enrollments.forEach((enrollment) => {
      enrollment.schedule.forEach((day: string) => allDays.add(day));
    });

    const daysOfWeek: string[] = Array.from(allDays);

    if (mostRecentSession === undefined || mostRecentSession === null) {
      mostRecentDate = new Date(0);
    }

    const dates = getSessionsSince(mostRecentDate, daysOfWeek);

    const newSessions = dates.map((date: Date) => {
      // Create default values for the new session
      const dayOfWeek = ["Su", "M", "T", "W", "Th", "F", "Sa"][date.getUTCDay()];

      const enrolledStudents = enrollments.filter((enrollment) =>
        enrollment.schedule.includes(dayOfWeek),
      );

      const studentsInfo: StudentInfo[] = enrolledStudents.map((enrollment) => ({
        studentId: enrollment.studentId,
        attended: true,
        hoursAttended: 0,
      }));

      const newSession: SessionBody = {
        programId: program._id,
        students: studentsInfo,
        marked: false,
        date,
        sessionTime: { start_time: "00:00", end_time: "00:00" },
        isAbsenceSession: false,
      };

      return newSession;
    });
    return SessionModel.create(newSessions);
  });
  return await Promise.all(programPromises);
};

// Call when creating a session from absence
export const createAbsenceSession: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    validationErrorParser(errors);

    const sessionData = req.body as AbsenceCreateBody;
    const programForm = await SessionModel.findOneAndUpdate(
      {
        date: sessionData.date,
        programId: sessionData.programId,
      },
      { $push: { students: sessionData.student } },
      { upsert: true, new: true },
    );
    await AbsenceSessionModel.findOneAndDelete({
      programId: sessionData.programId,
      studentId: sessionData.student.studentId,
    });

    res.status(201).json(programForm);
  } catch (error) {
    next(error);
  }
};

// Call when attendance is marked
export const updateSession: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    validationErrorParser(errors);

    const programData = req.body as UpdateSessionBody;

    const editedProgram = await SessionModel.findOneAndUpdate(
      { _id: programData._id },
      programData,
      {
        new: true,
      },
    );

    if (!editedProgram) {
      return res.status(404).json({ message: "No object in database with provided ID" });
    }

    programData.students.forEach(async (student: StudentInfo) => {
      const enrollment = await EnrollmentModel.findOne({
        studentId: student.studentId,
        programId: programData.programId,
      });
      if (enrollment) {
        const hours = enrollment.hoursLeft - student.hoursAttended;
        enrollment.hoursLeft = hours > 0 ? hours : 0;
        await enrollment.save();
      }
    });

    const absentStudents = programData.students.filter((student: StudentInfo) => !student.attended);

    const absenceSessions = absentStudents.map((absentStudent) => ({
      programId: programData.programId,
      studentId: absentStudent.studentId,
    }));

    await AbsenceSessionModel.create(absenceSessions);

    res.status(200).json(editedProgram);
  } catch (error) {
    next(error);
  }
};

// Call when frontpage to load recent sessions is called
export const getRecentSessions: RequestHandler = async (_, res, next) => {
  try {
    await createMissingRegularSessions();
    await createMissingVaryingSessions();
    // Show in terms of pacific time
    const currTime = new Date(new Date().getTime() - 7 * 60 * 60 * 1000);
    const sessions = await SessionModel.find({ marked: false, date: { $lte: currTime } });

    res.status(200).json(sessions);
  } catch (error) {
    next(error);
  }
};

// Call when looking to populate absence cards
export const getAbsenceSessions: RequestHandler = async (_, res, next) => {
  try {
    const sessions = await AbsenceSessionModel.find();

    res.status(200).json(sessions);
  } catch (error) {
    next(error);
  }
};
