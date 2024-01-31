import { Request, Response } from "express";
import { validationResult } from "express-validator";
import admin from "firebase-admin";

import { ValidationError } from "../errors";
import { errorHandler } from "../errors/handler";
import User, { UserDocument } from "../models/user";
import { firebaseAuth } from "../util/firebase";

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
) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }
    if (!errors.isEmpty()) {
      let errStr = "";
      for (const err of errors.array()) {
        errStr += err.msg + " ";
      }
      errStr = errStr.trim();
      throw new ValidationError(0, 400, errStr);
    }

    const { name, accountType, email, password } = req.body;

    // Create user in Firebase
    const userRecord = await firebaseAuth.createUser({
      email,
      password,
    } as admin.auth.CreateRequest); // Type assertion

    // Set custom claim for accountType (“admin” | “team”)
    await firebaseAuth.setCustomUserClaims(userRecord.uid, { accountType });

    // Create user in MongoDB
    const newUser: UserDocument = new User({
      _id: userRecord.uid, // Set document id to firebaseUID (Linkage between Firebase and MongoDB)
      name,
      accountType,
      // approvalStatus default false in User constructor
    } as UserDocument); // Type assertion

    await newUser.save();

    // const newUser = await User.create({
    //   _id: userRecord.uid, // Set document id to firebaseUID (Linkage between Firebase and MongoDB)
    //   name,
    //   accountType,
    //   // approvalStatus default false in User constructor
    // } as UserDocument);

    res.status(201).json({ message: "User created successfully" });
    // res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    errorHandler(ValidationError.USER_CREATION_UNSUCCESSFUL, req, res);
  }

  return;
};
