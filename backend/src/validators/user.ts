import { ValidationChain, body } from "express-validator";

export const createUser: ValidationChain[] = [
  body("name").notEmpty().isString(),
  body("gender").notEmpty().isString(),
  body("accountType").notEmpty().isIn(["admin", "team"]),
  body("approvalStatus").notEmpty().isBoolean(),
  body("email").notEmpty().isEmail(),
  body("password").notEmpty().isString().isLength({ min: 6 }),
];
