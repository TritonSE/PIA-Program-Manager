import { ValidationChain, body } from "express-validator";

export const createUser: ValidationChain[] = [
  body("name")
    .notEmpty()
    .withMessage("Body cannot be empty.")
    .isString()
    .withMessage("Invaid name format."),
  body("accountType")
    .notEmpty()
    .withMessage("accountType cannot be empty.")
    .isIn(["admin", "team"])
    .withMessage("Invaid accountType."),
  body("email")
    .notEmpty()
    .withMessage("Email cannot be empty.")
    .isEmail()
    .withMessage("Invaid email."),
  body("password")
    .notEmpty()
    .withMessage("Password cannot be empty.")
    .isString()
    .withMessage("Invalid password format.")
    .isLength({ min: 6 })
    .withMessage("Invaid password length (>6)."),
];

export const loginUser: ValidationChain[] = [
  body("email")
    .notEmpty()
    .withMessage("Email cannot be empty.")
    .isEmail()
    .withMessage("Invalid email format."),
  body("password")
    .notEmpty()
    .withMessage("Email cannot be empty.")
    .isString()
    .withMessage("Invalid password format."),
];
