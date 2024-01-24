import { Request, Response } from "express";
import admin from "firebase-admin";

import { firebaseAuth } from "../firebase/firebase_config";
import User, { UserDocument } from "../models/User";
import { UserError } from "../errors";
import { errorHandler } from "../errors/handler";

// Define the type for req.body
type CreateUserRequestBody = {
  name: string;
  gender: string;
  accountType: "admin" | "team";
  approvalStatus: boolean;
  email: string;
  password: string;
};

export const createUser = async (
  req: Request<Record<string, never>, Record<string, never>, CreateUserRequestBody>,
  res: Response,
) => {
  try {
    const { name, gender, accountType, approvalStatus, email, password } = req.body;

    // Create user in Firebase
    const userRecord = await firebaseAuth.createUser({
      email,
      password,
    } as admin.auth.CreateRequest); // Type assertion

    // Set custom claim for accountType (“admin” | “team”)
    await firebaseAuth.setCustomUserClaims(userRecord.uid, { accountType });

    // Create user in MongoDB
    const newUser = new User({
      _id: userRecord.uid, // Set document id to firebaseUID (Linkage between Firebase and MongoDB)
      name,
      gender,
      accountType,
      approvalStatus,
    } as UserDocument); // Type assertion

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    errorHandler(UserError.USER_CREATION_UNSUCCESSFUL, req, res);
  }

  return;
};
