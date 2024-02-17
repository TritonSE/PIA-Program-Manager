/**
 * Student document validator
 */

import { body } from "express-validator";
import mongoose from "mongoose";

//designed these to use the globstar operator from express-validator to more cleanly

const makeIdValidator = () =>
  body("**._id")
    .exists()
    .withMessage("ID is required")
    .bail()
    .custom((value: string) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Mongo ID format is invalid");

//validate contacts
const makeLastNamesValidator = () =>
  body("**.lastName")
    .exists()
    .withMessage("Last name required")
    .bail()
    .isString()
    .withMessage("Last name must be a string")
    .bail()
    .notEmpty()
    .withMessage("Last name required");

const makeFirstNamesValidator = () =>
  body("**.firstName")
    .exists()
    .withMessage("First name required")
    .bail()
    .isString()
    .withMessage("First name must be a string")
    .bail()
    .notEmpty()
    .withMessage("First name required");

const makeEmailsValidator = () =>
  body("**.email")
    .exists()
    .withMessage("Email required")
    .bail()
    .isEmail()
    .withMessage("Field must be a valid email")
    .bail()
    .notEmpty()
    .withMessage("Email required");

//Currently only accepts phone numbers as either 10 or 11 digit numbers
const makePhoneNumbersValidator = () =>
  body("**.phoneNumber")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("Phone number required")
    .bail()
    .matches(/^(?:\d{10}|\d{3}-\d{3}-\d{4})$/)
    .withMessage("Phone number must be in the format 1234567890 or 123-123-1234");

//validate location
const makeLocationValidator = () =>
  body("location")
    .exists()
    .withMessage("Location field fequired")
    .bail()
    .isString()
    .withMessage("Location must be a string")
    .bail()
    .notEmpty()
    .withMessage("Location field required");

//medication
const makeMedicationValidator = () =>
  body("medication")
    .exists()
    .withMessage("Medication field required")
    .bail()
    .isString()
    .withMessage("Medication must be a string")
    .bail()
    .notEmpty()
    .withMessage("Medication field required");

//birthday
const makeBirthdayValidator = () =>
  body("birthday")
    .exists()
    .withMessage("Birthday field required")
    .bail()
    .isISO8601()
    .toDate()
    .withMessage("Birthday string must be a valid date-time string");

//intake date
const makeIntakeDateValidator = () =>
  body("intakeDate")
    .exists()
    .withMessage("Intake Date field required")
    .bail()
    .isISO8601()
    .toDate()
    .withMessage("Intake Date string must be a valid date-time string");

//tour date
const makeTourDateValidator = () =>
  body("tourDate")
    .exists()
    .withMessage("Tour Date field required")
    .bail()
    .isISO8601()
    .toDate()
    .withMessage("Tour Date string must be a valid date-time string");

//prog1 --placeholder, will later validate for a program objectid
const makeRegularProgramsValidator = () =>
  body("regularPrograms")
    .exists()
    .withMessage("Regular Programs field required")
    .bail()
    .isArray({ min: 1 })
    .withMessage("Regular Programs must be a non-empty array")
    .bail();

//prog2
const makeVaryingProgramsValidator = () =>
  body("varyingPrograms")
    .exists()
    .withMessage("Varying Programs field required")
    .bail()
    .isArray({ min: 1 })
    .withMessage("Varying Programs must be a non-empty array");

//dietary
//validates entire array
const makeDietaryArrayValidator = () =>
  body("dietary")
    .optional()
    .exists()
    .isArray()
    .withMessage("Dietary restrictions must be an array");
//validates individual items
const makeDietaryItemsValidator = () =>
  body("dietary.*").exists().isString().withMessage("Dietary restriction element must be a string");

const makeDietaryOtherValidator = () =>
  body("otherString")
    .optional()
    .isString()
    .withMessage("Other dietary restriction must be a string");

export const createStudent = [
  makeLastNamesValidator(),
  makeFirstNamesValidator(),
  makeEmailsValidator(),
  makePhoneNumbersValidator(),
  makeLocationValidator(),
  makeMedicationValidator(),
  makeBirthdayValidator(),
  makeIntakeDateValidator(),
  makeTourDateValidator(),
  makeRegularProgramsValidator(),
  makeVaryingProgramsValidator(),
  makeDietaryArrayValidator(),
  makeDietaryItemsValidator(),
  makeDietaryOtherValidator(),
];

export const editStudent = [...createStudent, makeIdValidator()];
