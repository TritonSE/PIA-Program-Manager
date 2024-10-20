import { body } from "express-validator";
//import mongoose from "mongoose";

import { Program } from "../controllers/program";
import ProgramModel from "../models/program";

const makeNameValidator = () =>
  body("name")
    .exists()
    .withMessage("name needed")
    .bail()
    .isString()
    .withMessage("name must be a string")
    .bail()
    .notEmpty()
    .withMessage("name must not be empty")
    .custom((value: string) => {
      // needed for students table dropdown filtering
      if (value.includes(";")) throw new Error("name cannot contain semicolons");
      return true;
    });
const makeAbbreviationValidator = () =>
  body("abbreviation")
    .exists()
    .withMessage("abbreviation needed")
    .bail()
    .isString()
    .withMessage("abbreviation must be a string")
    .bail()
    .notEmpty()
    .withMessage("abbreviation must not be empty")
    .custom(async (value: string, { req }) => {
      const program = await ProgramModel.findOne({
        _id: { $ne: (req.body as Program)._id },
        abbreviation: value,
      });
      if (program) throw new Error("Program Abbreviation must be unique");
      return true;
    });
const makeTypeValidator = () =>
  body("type")
    .exists()
    .withMessage("type needed")
    .bail()
    .isString()
    .withMessage("type must be a string")
    .bail()
    .notEmpty()
    .withMessage("type must not be empty")
    .custom((value: string) => {
      if (value !== "regular" && value !== "varying")
        throw new Error("program type must be regular or varying");
      return true;
    });
const makeDaysOfWeekValidator = () =>
  body("daysOfWeek")
    .exists()
    .withMessage("days of week selection needed")
    .bail()
    .isArray()
    .withMessage("days of week selection must be an array")
    .custom((value: string[], { req }) => {
      if ((req.body as Program).type === "varying") {
        if (value.length !== 0) throw new Error("Varying sessions cannot assigned Days of Week");
        return true;
      }

      if (value.length === 0) throw new Error("days of week selection needed");
      for (const valuei of value) {
        if (
          valuei !== "M" &&
          valuei !== "T" &&
          valuei !== "W" &&
          valuei !== "Th" &&
          valuei !== "F" &&
          valuei !== "Sa" &&
          valuei !== "Su"
        )
          throw new Error("days of week selection must be M, T, W, Th, F, Sa, or Su");
      }
      return true;
    });
/*const makeStartDateValidator = () =>
  body("startDate")
    .exists()
    .withMessage("start date needed")
    .bail()
    .isISO8601()
    .withMessage("start date must be a valid date-time string");
const makeEndDateValidator = () =>
  body("endDate")
    .exists()
    .withMessage("end date needed")
    .bail()
    .isISO8601()
    .withMessage("end date must be a valid date-time string")
    .bail()
    .custom((value: string, { req }) => {
      const reqBody: Program = req.body as Program;
      if (new Date(value) < new Date(reqBody.startDate))
        throw new Error("end date must be after start date");
      return true;
    });*/

const makeColorValidator = () =>
  body("color")
    .exists()
    .withMessage("color needed")
    .bail()
    .isString()
    .withMessage("color hex should be string")
    .isLength({ min: 7, max: 7 })
    .withMessage("color hex should have 7 characters")
    .bail()
    .notEmpty()
    .withMessage("color hex required")
    .bail()
    .custom((value: string) => {
      if (value.length !== 7) throw new Error("color hex should have 7 characters");
      if (!value.startsWith("#")) throw new Error("color hex should start with #");
      for (let i = 1; i <= 6; i++) {
        const code = value.charCodeAt(i);
        if (
          !(code > 47 && code < 58) && // numeric (0-9)
          !(code > 64 && code < 91)
        ) {
          // upper alpha (A-Z)
          throw new Error("color hex must be a hex string, with characters 0-9 or A-F");
        }
      }
      return true;
    });
/*const makeStudentUIDsValidator = () =>
  // mongoID
  body("studentUIDs")
    .exists()
    .withMessage("student UIDs list needed")
    .bail()
    .isArray()
    .bail()
    .withMessage("students must be an array")
    .custom((students: string[]) => {
      students.forEach((studentId) => {
        if (!mongoose.Types.ObjectId.isValid(studentId))
          throw new Error("students must be valid student ids");
      });
      return true;
    })
    .bail()
    .withMessage("students must be valid student ids");*/
/*const makeRenewalDateValidator = () =>
  body("renewalDate")
    .exists()
    .withMessage("renewal date needed")
    .bail()
    .isISO8601()
    .withMessage("renewal date must be a valid date-time string");*/

const makeHourlyPayValidator = () =>
  body("hourlyPay")
    .exists()
    .withMessage("hourly pay needed")
    .bail()
    .isNumeric()
    .withMessage("hourly pay must be a valid number")
    .bail();

const makeSessionsValidator = () =>
  body("sessions")
    .exists()
    .withMessage("Must specify a session time")
    .bail()
    .isArray()
    .withMessage("Sessions must be a 2D String Array")
    .bail()
    .custom((sessions: { start_time: string; end_time: string }[], { req }) => {
      if ((req.body as Program).type === "varying") {
        if (sessions.length !== 0) throw new Error("Varying sessions cannot have session times");
        return true;
      }
      // Assumes program type is regular
      if (sessions.length === 0) throw new Error("Must specify a session time");
      sessions.forEach((session) => {
        if (!(session.start_time && session.end_time))
          throw new Error("Must specify a session time");
        if (typeof session.start_time !== "string" || typeof session.end_time !== "string")
          throw new Error("Session times must be strings");
        if (!new RegExp("^([01][0-9]|0[0-9]|2[0-3]):[0-5][0-9]$").test(session.start_time))
          throw new Error("Time must mach HH:MM format (ex. 09:00)");
        if (!new RegExp("^([01][0-9]|0[0-9]|2[0-3]):[0-5][0-9]$").test(session.end_time))
          throw new Error("Time must mach HH:MM format (ex. 09:00)");
      });
      return true;
    });

export const createProgram = [
  makeNameValidator(),
  makeAbbreviationValidator(),
  makeTypeValidator(),
  makeDaysOfWeekValidator(),
  //makeStartDateValidator(),
  //makeEndDateValidator(),
  makeColorValidator(),
  //makeRenewalDateValidator(),
  makeHourlyPayValidator(),
  makeSessionsValidator(),
];

export const updateProgram = [
  makeNameValidator(),
  makeAbbreviationValidator(),
  makeTypeValidator(),
  makeDaysOfWeekValidator(),
  //makeStartDateValidator(),
  //makeEndDateValidator(),
  makeColorValidator(),
  //makeRenewalDateValidator(),
  makeHourlyPayValidator(),
  makeSessionsValidator(),
  //makeStudentUIDsValidator(),
];
