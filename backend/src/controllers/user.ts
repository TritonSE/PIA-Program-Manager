import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import admin from "firebase-admin";

import User, { UserDocument } from "../models/user";
import { firebaseAuth } from "../util/firebase";
import validationErrorParser from "../util/validationErrorParser";

// Define the type for req.body
type CreateUserRequestBody = {
  name: string;
  accountType: "admin" | "team";
  email: string;
  password: string;
};

export const createUser = async (
  req: Request<Record<string, never>, Record<string, never>, CreateUserRequestBody>,
  res: Response,
  nxt: NextFunction,
) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);

    validationErrorParser(errors);

    const { name, accountType, email, password } = req.body;

    // Create user in Firebase
    const userRecord = await firebaseAuth.createUser({
      email,
      password,
    } as admin.auth.CreateRequest); // Type assertion

    // Set custom claim for accountType (“admin” | “team”)
    await firebaseAuth.setCustomUserClaims(userRecord.uid, { accountType });

    const newUser2 = await User.create({
      _id: userRecord.uid, // Set document id to firebaseUID (Linkage between Firebase and MongoDB)
      name,
      accountType,
      // approvalStatus default false in User constructor
    } as UserDocument);

    res.status(201).json(newUser2);
  } catch (error) {
    console.error(error);
    nxt(error);
  }

  return;
};
