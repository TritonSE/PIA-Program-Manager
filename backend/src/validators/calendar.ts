import { body } from "express-validator";

// const makeDateValidator = () =>
//     body("date")
//         .exists()
//         .withMessage("date needed")
//         .bail()
//         .isDate()
//         .bail();

const makeHoursValidator = () =>
  body("hours")
    .exists()
    .withMessage("hours needed")
    .bail()
    .isNumeric()
    .withMessage("needs to be number")
    .bail();

const makeSessionValidator = () =>
  body("session")
    .exists()
    .withMessage("sessionId needed")
    .bail()
    .isString()
    .withMessage("needs to be string")
    .bail();

export const editCalendar = [
  // makeDateValidator(),
  makeHoursValidator(),
  makeSessionValidator(),
];
