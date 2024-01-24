import { body } from "express-validator";

import { typeProgramForm } from "../controllers/program-form";

// more info about validators:
// https://express-validator.github.io/docs/guides/validation-chain
// https://github.com/validatorjs/validator.js#validators

// const makeIDValidator = () =>
//   body("_id")
//     .exists()
//     .withMessage("_id is required")
//     .bail()
//     .isMongoId()
//     .withMessage("_id must be a MongoDB object ID");
// const makeTitleValidator = () =>
//   body("title")
//     // title must exist, if not this message will be displayed
//     .exists()
//     .withMessage("title is required")
//     // bail prevents the remainder of the validation chain for this field from being executed if
//     // there was an error
//     .bail()
//     .isString()
//     .withMessage("title must be a string")
//     .bail()
//     .notEmpty()
//     .withMessage("title cannot be empty");
const makeNameValidator = () =>
  body("name")
    .exists()
    .withMessage("name needed")
    .bail()
    .isString()
    .withMessage("name must be a string")
    .bail()
    .notEmpty()
    .withMessage("name must not be empty");
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
    .withMessage("type must not be empty");
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
    .custom((value: Date, { req }) => {
      const reqBody: typeProgramForm = req.body as typeProgramForm;
      if (value < reqBody.startDate) throw new Error("end date must be after start date");
      return true;
    });
const makeColorValidator = () =>
  body("color")
    .exists()
    .withMessage("color needed")
    .bail()
    .isNumeric()
    .withMessage("color should be number 1-4")
    .bail()
    .custom((value) => {
      if (value < 1 || value > 4) {
        throw new Error("color must be an option number 1-4");
      }
      return true;
    });

// assignee is for Part 2.1
// const makeAssigneeValidator = () =>
//   body("assignee").optional().isMongoId().withMessage("assignee must be a MongoDB object ID");

// establishes a set of rules that the body of the task creation route must follow
export const createForm = [
  makeNameValidator(),
  makeAbbreviationValidator(),
  makeTypeValidator(),
  makeStartDateValidator(),
  makeEndDateValidator(),
  makeColorValidator(),
];

// export function createForm() {
//     makeIDValidator();
//     makeNameValidator();
//     makeAbbreviationValidator();
//     makeTypeValidator();
//     makeStartDateValidator();
//     makeEndDateValidator();
//     makeColorValidator();
// }

// export const updateForm = [
//   //   makeIDValidator(),
//   //   makeTitleValidator(),
//   //   makeDescriptionValidator(),
//   //   makeIsCheckedValidator(),
//   //   makeDateCreatedValidator(),
//   //   makeAssigneeValidator(), // for Part 2.1
// ];

// export function editForm(arg0: string, editForm: any, createForm: RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>) {
//     throw new Error("Function not implemented.");
// }
