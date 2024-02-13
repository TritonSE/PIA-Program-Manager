import { ValidationChain, body } from "express-validator";

export const createUser: ValidationChain[] = [
  body("name").notEmpty().isString().withMessage("Invaid name"),
  body("accountType").notEmpty().isIn(["admin", "team"]).withMessage("Invaid accountType"),
  body("email").notEmpty().isEmail().withMessage("Invaid email"),
  body("password").notEmpty().isString().isLength({ min: 6 }).withMessage("Invaid password"),
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
