// copied from onboarding repo - TODO
// only need create

/**
 * Functions that process task route requests.
 */

import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import { ValidationError } from "../errors/validation";
import ProgramFormModel from "../models/program-form";
//import validationErrorParser from "../util/validationErrorParser";

export type typeProgramForm = {
  name: string;
  abbreviation: string;
  type: string;
  startDate: string;
  endDate: string;
  color: string;
};

/**
 * This is an example of an Express API request handler. We'll tell Express to
 * run this function when our backend receives a request to retrieve a
 * particular task.
 *
 * Request handlers typically have 3 parameters: req, res, and next.
 *
 * @param req The Request object from Express. This contains all the data from
 * the API request. (https://expressjs.com/en/4x/api.html#req)
 * @param res The Response object from Express. We use this to generate the API
 * response for Express to send back. (https://expressjs.com/en/4x/api.html#res)
 * @param next The next function in the chain of middleware. If there's no more
 * processing we can do in this handler, but we're not completely done handling
 * the request, then we can pass it along by calling next(). For all of the
 * handlers defined in `src/controllers`, the next function is the global error
 * handler in `src/app.ts`.
 */
// export const getForm: RequestHandler = async (req, res, next) => {
//   const { id } = req.params;

//   try {
//     // if the ID doesn't exist, then findById returns null
//     const task = await TaskModel.findById(id);

//     if (task === null) {
//       throw createHttpError(404, "Task not found.");
//     }

//     // Set the status code (200) and body (the task object as JSON) of the response.
//     // Note that you don't need to return anything, but you can still use a return
//     // statement to exit the function early.
//     res.status(200).json(task);
//   } catch (error) {
//     // pass errors to the error handler
//     next(error);
//   }
// };

export const createForm: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    //validationErrorParser(errors);

    if (!errors.isEmpty()) {
      let errorString = "";

      for (const error of errors.array()) {
        errorString += error.msg + " ";
      }
      throw new ValidationError(errorString);
    }

    const programForm = await ProgramFormModel.create(req.body as typeProgramForm);

    res.status(201).json(programForm);
  } catch (error) {
    next(error);
  }
};

// export const removeForm: RequestHandler = async (req, res, next) => {
//   const { id } = req.params;

//   try {
//     const result = await TaskModel.deleteOne({ _id: id });

//     res.status(200).json(result);
//   } catch (error) {
//     next(error);
//   }
// };
