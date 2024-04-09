import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { signInWithEmailAndPassword } from "firebase/auth";
import admin from "firebase-admin";
import mongoose from "mongoose";

import { InternalError } from "../errors";
import { AuthError } from "../errors/auth";
import { ServiceError } from "../errors/service";
import { Image } from "../models/image";
import UserModel from "../models/user";
import { firebaseAdminAuth, firebaseAuth } from "../util/firebase";
import { saveImage } from "../util/image";
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
        console.log(user);
        return UserModel.findById(user.uid);
      })
      .then((user) => {
        if (user !== null) {
          res.status(200).json({ uid: user._id, approvalStatus: user.approvalStatus });
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

  return;
};

export const editPhoto = async (req: Request, res: Response, nxt: NextFunction) => {
  try {
    const errors = validationResult(req);

    validationErrorParser(errors);

    const imageId = await saveImage(req);

    res.status(200).json(imageId);
  } catch (error) {
    nxt(error);
  }

  return;
};

export const getPhoto = async (req: Request, res: Response, nxt: NextFunction) => {
  try {
    const imageId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(imageId)) {
      return res
        .status(ServiceError.INVALID_MONGO_ID.status)
        .send(ServiceError.INVALID_MONGO_ID.message);
    }
    const image = await Image.findById(imageId);
    if (!image) {
      throw ServiceError.IMAGE_NOT_FOUND;
    }
    console.log("image", image);
    return res.status(200).set("Content-type", image.mimetype).send(image.buffer);
  } catch (e) {
    console.log(e);
    if (e instanceof ServiceError) {
      nxt(e);
    }
    return res
      .status(InternalError.ERROR_GETTING_IMAGE.status)
      .send(InternalError.ERROR_GETTING_IMAGE.displayMessage(true));
  }
};
