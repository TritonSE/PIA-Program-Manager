/**
 * Student document validator
 */

import { body } from "express-validator";

//designed these to use the globstar operator from express-validator to more cleanly
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
    .exists()
    .withMessage("Phone number required")
    .bail()
    .isNumeric()
    .withMessage("Field must have a valid number")
    .isLength({ min: 10, max: 11 })
    .withMessage("Phone number has an incorrect length")
    .bail()
    .notEmpty()
    .withMessage("Phone number required");

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
    .withMessage("Birthday string must be a valid date-time string");

//intake date
const makeIntakeDateValidator = () =>
  body("intakeDate")
    .exists()
    .withMessage("Intake Date field required")
    .bail()
    .isISO8601()
    .withMessage("Intake Date string must be a valid date-time string");

//tour date
const makeTourDateValidator = () =>
  body("tourDate")
    .exists()
    .withMessage("Tour Date field required")
    .bail()
    .isISO8601()
    .withMessage("Tour Date string must be a valid date-time string");

//prog1 --placeholder, will later validate for a program objectid
const makeProg1Validator = () =>
  body("prog1")
    .exists()
    .withMessage("Program 1 field required")
    .bail()
    .isString()
    .withMessage("Program 1 must be a string");

//prog2
const makeProg2Validator = () =>
  body("prog2").optional().isString().withMessage("Program 2 must be a string");

//dietary
const makeDietaryValidator = () =>
  body("dietary.**").optional().isBoolean().withMessage("Dietary restrictions must be boolean");

//considering writing a custom validator to throw an error if the "other" field is filled but the "other"
//boolean field is unchecked
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
  makeProg1Validator(),
  makeProg2Validator(),
  makeDietaryValidator(),
  makeDietaryOtherValidator(),
];
