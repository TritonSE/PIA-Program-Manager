/**
 * Student document validator
 */

import { body } from "express-validator";
import mongoose from "mongoose";

import { programValidatorUtil } from "../util/student";

//designed these to use the globstar operator from express-validator to more cleanly

const isValidDateTimeString = (value: string) => {
  return !isNaN(Date.parse(value));
};

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
  body("location").optional().isString().withMessage("Location must be a string").bail();

//medication
const makeMedicationValidator = () =>
  body("medication").optional().isString().withMessage("Medication must be a string").bail();

//birthday
const makeBirthdayValidator = () =>
  body("birthday")
    .custom((value) => {
      if (!value) {
        return true;
      }
      if (!isValidDateTimeString(value as string)) {
        throw new Error("Intake Date string must be a valid date-time string");
      }
      return true;
    })
    .toDate();

//intake date
const makeIntakeDateValidator = () =>
  body("intakeDate")
    .custom((value) => {
      if (!value) {
        return true;
      }
      if (!isValidDateTimeString(value as string)) {
        throw new Error("Intake Date string must be a valid date-time string");
      }
      return true;
    })
    .toDate();

//tour date
const makeTourDateValidator = () =>
  body("tourDate")
    .custom((value) => {
      if (!value) {
        return true;
      }
      if (!isValidDateTimeString(value as string)) {
        throw new Error("Intake Date string must be a valid date-time string");
      }
      return true;
    })
    .toDate();

const makeConservationValidator = () =>
  body("conservation").optional().isBoolean().withMessage("Conservation must be a boolean");

const makeUCINumberValidator = () =>
  body("UCINumber").optional().isString().withMessage("UCI Number must be a string").bail();

type DocumentItem = {
  name: string;
  link: string;
  markedAdmin: boolean;
};

const makeIncidentFormValidator = () =>
  body("incidentForm").optional().isString().withMessage("Incident Form must be a string").bail();

const makeDocumentsValidator = () =>
  body("documents")
    .optional()
    .isArray()
    .withMessage("Documents must be an array")
    .bail()
    .custom((value: unknown): value is DocumentItem[] => {
      // Type guard to ensure value is an array of DocumentItem
      return (
        Array.isArray(value) &&
        value.every(
          (doc): doc is DocumentItem =>
            typeof doc === "object" &&
            doc !== null &&
            // Check 'name' property
            typeof doc.name === "string" &&
            doc.name.trim() !== "" &&
            // Check 'link' property
            typeof doc.link === "string" &&
            doc.link.trim() !== "" &&
            // Check 'markedAdmin' property (optional, must be boolean if present)
            (doc.markedAdmin === undefined || typeof doc.markedAdmin === "boolean"),
        )
      );
    })
    .withMessage(
      "Documents must be an array of objects with 'name', 'link', and 'markedAdmin' properties",
    );

const makeProfilePictureValidator = () =>
  body("profilePicture").optional().isString().withMessage("Profile picture must be a string");

const makeEnrollments = () =>
  body("enrollments")
    .optional()
    .isArray()
    .withMessage("Enrollments must be a non-empty array")
    .bail()
    .custom(programValidatorUtil);

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
  makeConservationValidator(),
  makeUCINumberValidator(),
  makeIncidentFormValidator(),
  makeDocumentsValidator(),
  makeProfilePictureValidator(),
  makeEnrollments(),
];

export const editStudent = [
  makeIdValidator(),
  [...createStudent].map((validator) => {
    validator.optional();
    return validator;
  }),
];
