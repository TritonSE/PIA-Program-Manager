import { body } from "express-validator";

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
// check for first chara being # and others being 1-F

export const createForm = [
  makeNameValidator(),
  makeAbbreviationValidator(),
  makeTypeValidator(),
  makeDaysOfWeekValidator(),
  makeStartDateValidator(),
  makeEndDateValidator(),
  makeColorValidator(),
];
