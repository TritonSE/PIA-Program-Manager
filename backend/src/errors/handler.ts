import { NextFunction, Request, Response } from "express";

// import { FirebaseError } from "firebase-admin";

import { CustomError } from "./errors";
import { InternalError } from "./internal";

// import type { FirebaseAuthError } from 'firebase-admin/lib/utils/error';

// function isFirebaseAuthError(error: FirebaseError): error is FirebaseAuthError {
//   return error.code.startsWith('auth/');
// }

/**
 * Generic Error Handler
 */
export const errorHandler = (err: any, _req: Request, res: Response, _nxt: NextFunction) => {
  // export const errorHandler = (err: Error, _req: Request, res: Response, _nxt: NextFunction) => {
  if (!err) return;

  // // Check if the error is a Firebase error
  // if (err instanceof FirebaseError) {
  //   console.log("Firebase Error:", err.message);
  //   res.status(500).send("Firebase Error: " + err.message);
  //   return;
  // }

  if (err.code === "auth/email-already-exists") {
    console.error("Firebase Auth Error:", err);
    return res.status(400).json({ error: "Email already exists", code: err.code });
  }

  if (err instanceof CustomError && !(err instanceof InternalError)) {
    console.log(err.displayMessage(true));
    res.status(err.status).send(err.displayMessage(true));
    return;
  }

  console.log("Internal Error", err);
  res.status(500).send("Unknown Error. Try Again");
};
