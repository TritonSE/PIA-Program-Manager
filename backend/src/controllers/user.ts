import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { signInWithEmailAndPassword } from "firebase/auth";
import admin from "firebase-admin";

import { AuthError } from "../errors/auth";
import UserModel from "../models/user";
import { firebaseAdminAuth, firebaseAuth } from "../util/firebase";
import validationErrorParser from "../util/validationErrorParser";

// Define the type for req.body
type CreateUserRequestBody = {
  name: string;
  accountType: "admin" | "team";
  email: string;
  password: string;
};

type LoginUserRequestBody = {
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
    const userRecord = await firebaseAdminAuth.createUser({
      email,
      password,
    } as admin.auth.CreateRequest); // Type assertion

    // Set custom claim for accountType (“admin” | “team”)
    await firebaseAdminAuth.setCustomUserClaims(userRecord.uid, { accountType });

    const newUser = await UserModel.create({
      _id: userRecord.uid, // Set document id to firebaseUID (Linkage between Firebase and MongoDB)
      name,
      accountType,
      // approvalStatus default false in User constructor
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    nxt(error);
  }

  return;
};

export const loginUser = async (
  req: Request<Record<string, never>, Record<string, never>, LoginUserRequestBody>,
  res: Response,
  nxt: NextFunction,
) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    validationErrorParser(errors);

    const { email, password } = req.body;
    // Sign user into Firebase
    await signInWithEmailAndPassword(firebaseAuth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        return UserModel.findById(user.uid);
      })
      .then((user) => {
        if (user !== null) {
          res.status(200).json({ uid: user._id, approvalStatus: user.approvalStatus });
          return;
        }
        throw AuthError.LOGIN_ERROR;
      })
      .catch(() => {
        throw AuthError.LOGIN_ERROR;
      });
  } catch (error) {
    console.error(error);
    nxt(error);
  }
};
