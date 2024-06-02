/**
 * Student document validator
 */

import { body } from "express-validator";
import mongoose from "mongoose";

import { programValidatorUtil } from "../util/student";

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

const makeConservationValidator = () =>
  body("conservation")
    .exists()
    .withMessage("Conservation field required")
    .bail()
    .isBoolean()
    .withMessage("Conservation must be a boolean");

const makeUCINumberValidator = () =>
  body("UCINumber")
    .exists()
    .withMessage("UCI Number field required")
    .bail()
    .isString()
    .withMessage("UCI Number must be a string")
    .bail()
    .notEmpty()
    .withMessage("UCI Number field required");

const makeIncidentFormValidator = () =>
  body("incidentForm")
    .exists()
    .withMessage("Incident Form field required")
    .bail()
    .isString()
    .withMessage("Incident Form must be a string")
    .bail()
    .notEmpty()
    .withMessage("Incident Form field required");

const makeDocumentsValidator = () =>
  body("documents")
    .exists()
    .withMessage("Documents field required")
    .bail()
    .isArray()
    .withMessage("Documents must be an array")
    .bail()
    .custom((value: string[]) => value.every((doc) => typeof doc === "string"))
    .withMessage("Documents must be an array of strings");

const makeProfilePictureValidator = () =>
  body("profilePicture").optional().isString().withMessage("Profile picture must be a string");

const makeEnrollments = () =>
  body("enrollments")
    .exists()
    .withMessage("Enrollments field required")
    .bail()
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

export const editStudent = [...createStudent, makeIdValidator()];
