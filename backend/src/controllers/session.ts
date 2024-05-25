import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import ProgramModel from "../models/program";
import SessionModel from "../models/session";
import EnrollmentModel from "../models/enrollment"
import validationErrorParser from "../util/validationErrorParser";
import mongoose from "mongoose";

type StudentInfo = {
  studentId: mongoose.Types.ObjectId;
  attended: boolean;
  hoursAttended: number;
};

interface Program {
  _id: mongoose.Types.ObjectId;
  name: string;
  abbreviation: string;
  type: string;
  daysOfWeek: string[];
  color: string; //colorValueHex;
  hourlyPay: number;
  sessions: { start_time: string; end_time: string; }[];
};

export type UpdateSessionBody = {
  _id: string;
  programId: string;
  sessionTime: { start_time: string; end_time: string; }
  students: StudentInfo[];
};

export type SessionBody = {
  programId: mongoose.Types.ObjectId;
  sessionTime: { start_time: string; end_time: string; }
  students: StudentInfo[];
  marked: Boolean;
};


export type AbsenceCreateBody = {
  _id: string;
  programId: string;
  date: Date;
  sessionTime: { start_time: string; end_time: string; }
  students: StudentInfo[];
};

// Call when creating a session from absence
export const createAbsenceSession: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    validationErrorParser(errors);

    const sessionData = req.body as AbsenceCreateBody;
    // Add student? This may bug
    const programForm = await SessionModel.findOneAndUpdate(
      { date: sessionData.date, programId: sessionData.programId, sessionTime: sessionData.sessionTime},
      sessionData,
      { upsert: true, new: true },
    );

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

    res.status(200).json(editedProgram);
  } catch (error) {
    next(error);
  }
};

// Call when frontpage to load recent sessions is called
export const getRecentSessions: RequestHandler = async (req, res, next) => {
  try {
    await createMissingSessions();
    // Change this to return "recent" sessions
    const sessions = await SessionModel.find();

    res.status(200).json(sessions);
  } catch (error) {
    next(error);
  }
};

const createMissingSessions = async () => {
  const programs = await ProgramModel.find().lean().exec();
  const programPromises = programs.map(async (program: Program) => {
    const mostRecentSession = await SessionModel.findOne({ programId: program._id })
                                            .sort({ date: -1 })
                                            .exec();
    let dates;                                      
    if (mostRecentSession !== undefined && mostRecentSession !== null) {
      dates = getSessionsSince(mostRecentSession.date, program.daysOfWeek);
    } else {
      dates = getSessionsSince(new Date(), program.daysOfWeek);
    }

    console.log(dates);

    const sessionPromises = dates.map(async (date) => {
      const dayOfWeek = ["SU", "M", "T", "W", "TH", "F", "S"][date.getDay()];
      await Promise.all(program.sessions.map(async (session) => {
        const enrollments = await EnrollmentModel.find({
          sessionTime: session,
          schedule: dayOfWeek,
          startDate: { $lte: date },
          programId: program._id
        });
        const studentsInfo: StudentInfo[] = enrollments.map((enrollment) => ({
          studentId: enrollment.studentId,
          attended: true, 
          hoursAttended: hoursAttended(session.start_time, session.end_time)
        }));
        const newSession: SessionBody = {
          programId: program._id,
          sessionTime: session,
          students: studentsInfo,
          marked: false
        }
        return SessionModel.findOneAndUpdate(
          { date: date, programId: program._id},
          newSession,
          { upsert: true, new: true },
        );
      }))
    })
    await Promise.all(sessionPromises);
   
  });
  await Promise.all(programPromises);
}

function getSessionsSince(start: Date, daysOfWeek: string[]): Date[] {
  const datesBetween: Date[] = [];
  const currentDate = new Date(start);
  while (currentDate <= new Date()) {
    const dayOfWeek = currentDate.getDay();
    const abbreviatedDay = ["SU", "M", "T", "W", "TH", "F", "S"][dayOfWeek];
    if (daysOfWeek.includes(abbreviatedDay)) {
      datesBetween.push(new Date(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return datesBetween;
}

const hoursAttended = (start_time: string, end_time: string) => {
  const [startHour, startMinute] = start_time.split(":").map(Number);
  const [endHour, endMinute] = end_time.split(":").map(Number);
  return (endHour - startHour) + (endMinute - startMinute >= 30 ? 1 : 0);
};
