import { NextFunction, Request, Response } from "express";

import { CustomError } from "./errors";
import { InternalError } from "./internal";

/**
 * Generic Error Handler
 */
export const errorHandler = (err: Error, req: Request, res: Response, _: NextFunction) => {
  if (!err) return;
  if (err instanceof CustomError && !(err instanceof InternalError)) {
    console.log(err.displayMessage(true));
    res.status(err.status).send(err.displayMessage(true));
    return;
  }

  console.log("Internal Error", err);
  res.status(500).send("Unknown Error. Try Again");
};
