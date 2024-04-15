import { body } from "express-validator";
// import mongoose from "mongoose";

import { Program } from "../controllers/program";

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
    .withMessage("abbreviation must not be empty");
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
    .custom((value: string[]) => {
      if (value.length === 0) throw new Error("days of week selection needed");
      for (const valuei of value) {
        if (valuei !== "M" && valuei !== "T" && valuei !== "W" && valuei !== "TH" && valuei !== "F")
          throw new Error("days of week selection must be M, T, W, TH, or F");
      }
      return true;
    });
const makeStartDateValidator = () =>
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
    });
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
// const makeStudentUIDsValidator = () =>
//   // mongoID
//   body("studentUIDs")
//     .exists()
//     .withMessage("student UIDs list needed")
//     .bail()
//     .isArray()
//     .bail()
//     .withMessage("students must be an array")
//     .custom((students: string[]) => {
//       students.forEach((studentId) => {
//         if (!mongoose.Types.ObjectId.isValid(studentId))
//           throw new Error("students must be valid student ids");
//       });
//       return true;
//     })
//     .bail()
//     .withMessage("students must be valid student ids");
const makeRenewalDateValidator = () =>
  body("renewalDate")
    .exists()
    .withMessage("renewal date needed")
    .bail()
    .isISO8601()
    .withMessage("renewal date must be a valid date-time string");
const makeHourlyPayValidator = () =>
  body("hourlyPay")
    .exists()
    .withMessage("hourly pay needed")
    .bail()
    .isNumeric()
    .withMessage("hourly pay must be a valid number");
const makeSessionsValidator = () =>
  body("sessions")
    .exists()
    .withMessage("sessions list needed")
    .bail()
    .isArray()
    .withMessage("sessions list must be an array")
    .custom((value: [string[]]) => {
      for (const arr of value) {
        // each time interval must be array
        if (!Array.isArray(arr)) throw new Error("each session must be formatted as an array");
        // array: [10:00, 13:00]
        for (let j = 0; j <= 1; j++) {
          if (arr[j].length !== 5) throw new Error("times should be 5 characters, in XX:XX format");
          if (arr[j][2] !== ":") throw new Error("middle character should be :");
          // first character is 0 or 1
          if (arr[j].charCodeAt(0) === 48 || arr[j].charCodeAt(0) === 49) {
            if (!(arr[j].charCodeAt(1) > 47 && arr[j].charCodeAt(1) < 58))
              throw new Error("second number should be 0-9");
          }
          // first character is 2
          else if (arr[j].charCodeAt(0) === 50) {
            if (!(arr[j].charCodeAt(1) > 47 && arr[j].charCodeAt(1) < 52))
              throw new Error("second number should be 0-3");
          } else {
            throw new Error("first number should be 0, 1, or 2");
          }
          // third character is 0 - 5
          if (!(arr[j].charCodeAt(3) > 47 && arr[j].charCodeAt(3) < 54))
            throw new Error("third number should be 0-5");
          // fourth character is 0 - 9
          if (!(arr[j].charCodeAt(4) > 47 && arr[j].charCodeAt(4) < 58))
            throw new Error("fourth number should be 0-9");
          for (let i = 0; i <= 4; i++) {
            if (i === 2) continue;
            const code = arr[j].charCodeAt(i);
            if (!(code > 47 && code < 58)) {
              // numeric (0-9)
              throw new Error("color hex must be a hex string, with characters 0-9 or A-F");
            }
          }
        }
      }
      return true;
    });

export const createProgram = [
  makeNameValidator(),
  makeAbbreviationValidator(),
  makeTypeValidator(),
  makeDaysOfWeekValidator(),
  makeStartDateValidator(),
  makeEndDateValidator(),
  makeColorValidator(),
  makeRenewalDateValidator(),
  makeHourlyPayValidator(),
  makeSessionsValidator(),
];

export const updateProgram = [
  makeNameValidator(),
  makeAbbreviationValidator(),
  makeTypeValidator(),
  makeDaysOfWeekValidator(),
  makeStartDateValidator(),
  makeEndDateValidator(),
  makeColorValidator(),
  makeRenewalDateValidator(),
  makeHourlyPayValidator(),
  makeSessionsValidator(),
];
