import { ValidationChain, body } from "express-validator";

export const createProgressNote: ValidationChain[] = [
  body("studentId")
    .exists()
    .withMessage("Student ID cannot be empty.")
    .isString()
    .withMessage("Student ID must be a string."),
  body("dateLastUpdated")
    .notEmpty()
    .withMessage("Date cannot be empty.")
    .isISO8601()
    .withMessage("Invalid Date format."),
  body("content")
    .isString()
    .withMessage("Content must be a string.")
    .notEmpty()
    .withMessage("Content cannot be empty."),
];
