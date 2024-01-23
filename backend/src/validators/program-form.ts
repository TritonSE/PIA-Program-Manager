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
const makeNameValidator = () => body("name").isString().withMessage("name must be a string");
const makeAbbreviationValidator = () =>
  body("abbreviation").isString().withMessage("abbreviation must be a string");
const makeTypeValidator = () => body("type").isString().withMessage("type must be a string");
const makeStartDateValidator = () =>
  body("startDate").isISO8601().withMessage("startDate must be a valid date-time string");
const makeEndDateValidator = () =>
  body("endDate")
    .isISO8601()
    .custom((value: Date, { req }) => {
      const reqBody: typeProgramForm = req.body as typeProgramForm;
      if (value < reqBody.startDate) throw new Error("end date must be after start date");
      return true;
    });
const makeColorValidator = () =>
  body("color")
    .isNumeric()
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
