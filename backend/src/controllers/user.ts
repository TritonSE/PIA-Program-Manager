import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import admin from "firebase-admin";
import mongoose from "mongoose";

import { InternalError } from "../errors";
import { ServiceError } from "../errors/service";
import { ValidationError } from "../errors/validation";
import { Image } from "../models/image";
import UserModel from "../models/user";
import { sendApprovalEmail, sendDenialEmail } from "../util/email";
import { firebaseAdminAuth } from "../util/firebase";
import { handleImageParsing } from "../util/image";
import { deleteUserFromFirebase, deleteUserFromMongoDB } from "../util/user";
import validationErrorParser from "../util/validationErrorParser";

import { UserIdRequestBody } from "./types/types";
import {
  CreateUserRequestBody,
  EditEmailRequestBody,
  EditLastChangedPasswordRequestBody,
  EditNameRequestBody,
  EditPhotoRequestBody,
  LoginUserRequestBody,
  UpdateAccountTypeRequestBody,
} from "./types/userTypes";

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
      email,
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    nxt(error);
  }

  return;
};

export const deleteUser = async (req: Request, res: Response, nxt: NextFunction) => {
  try {
    const { email } = req.params;

    // Find the user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    const userId = user._id; // _id is the uid in schema

    // delete user from Firebase and MongoDB
    await deleteUserFromFirebase(userId);
    await deleteUserFromMongoDB(userId);

    res.status(200).send("User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
    nxt(error);
  }
};

export const getNotApprovedUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const notApprovedUsers: User[] = await UserModel.find({ approvalStatus: false }).exec();
    const notApprovedUsers = await UserModel.find({ approvalStatus: false }).exec();

    res.status(200).json(notApprovedUsers);
  } catch (error) {
    console.error("Error fetching not-approved users:", error);
    next(error);
  }
};

export const approveUser = async (req: Request, res: Response, nxt: NextFunction) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const userId = user._id;

    await UserModel.findByIdAndUpdate(userId, { approvalStatus: true });

    // await sendApprovalEmail(email);
    await sendApprovalEmail(email as string);

    res.status(200).send("User approved successfully");
  } catch (error) {
    console.error(error);
    nxt(error);
  }
};

export const denyUser = async (req: Request, res: Response, nxt: NextFunction) => {
  console.log("Inside denyUser controller");

  try {
    const { email } = req.body;

    console.log("Email from request body:", email);

    // const user = await UserModel.findOne({ email });
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).send("User not found");
    }

    console.log("User object:", user);

    const userId = user._id;

    await UserModel.findByIdAndUpdate(userId, { approvalStatus: false });

    console.log(email as string);
    await sendDenialEmail(email as string);

    res.status(200).send("User denied successfully");
  } catch (error) {
    console.error(error);
    nxt(error);
  }
};

export const loginUser = async (
  req: Request<Record<string, never>, Record<string, never>, LoginUserRequestBody>,
  res: Response,
  nxt: NextFunction,
) => {
  try {
    const uid = req.body.uid;
    const user = await UserModel.findById(uid);
    if (!user) {
      throw ValidationError.USER_NOT_FOUND;
    }
    res.status(200).json(user);
    return;
  } catch (e) {
    nxt();
    console.log(e);
    return res.status(400).json({
      error: e,
    });
  }
};

export const editPhoto = (req: EditPhotoRequestBody, res: Response, nxt: NextFunction) => {
  try {
    //Validation logic inside handleImageParsing
    handleImageParsing(req, res, nxt);
  } catch (e) {
    console.log(e);
    nxt(e);
  }
};

export const getPhoto = async (
  req: Request<Record<string, never>, Record<string, never>, UserIdRequestBody>,
  res: Response,
  nxt: NextFunction,
) => {
  try {
    const { uid } = req.body;
    const { id: imageId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(imageId)) {
      return res
        .status(ValidationError.INVALID_MONGO_ID.status)
        .send({ error: ValidationError.INVALID_MONGO_ID.message });
    }

    const user = await UserModel.findById(uid);
    if (!user) {
      throw ValidationError.USER_NOT_FOUND;
    }

    const image = await Image.findById(imageId);
    if (!image) {
      throw ValidationError.IMAGE_NOT_FOUND;
    }

    if (image.userId !== uid) {
      throw ValidationError.IMAGE_USER_MISMATCH;
    }

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

export const editName = async (
  req: Request<Record<string, never>, Record<string, never>, EditNameRequestBody>,
  res: Response,
  nxt: NextFunction,
) => {
  try {
    const { uid, newName } = req.body;

    const errors = validationResult(req);

    validationErrorParser(errors);

    const user = await UserModel.findById(uid);

    if (!user) {
      throw ValidationError.USER_NOT_FOUND;
    }

    await UserModel.findByIdAndUpdate(uid, { name: newName });

    res.status(200).json(newName);
  } catch (error) {
    nxt(error);
    return res.status(400).json({
      error,
    });
  }
};

export const editEmail = async (
  req: Request<Record<string, never>, Record<string, never>, EditEmailRequestBody>,
  res: Response,
  nxt: NextFunction,
) => {
  try {
    const { uid, newEmail } = req.body;

    const errors = validationResult(req);

    validationErrorParser(errors);

    await firebaseAdminAuth.updateUser(uid, { email: newEmail });

    const user = await UserModel.findById(uid);

    if (!user) {
      throw ValidationError.USER_NOT_FOUND;
    }

    await UserModel.findByIdAndUpdate(uid, { email: newEmail });

    return res.status(200).json(newEmail);
  } catch (error) {
    nxt(error);
  }
};

export const editLastChangedPassword = async (
  req: Request<Record<string, never>, Record<string, never>, EditLastChangedPasswordRequestBody>,
  res: Response,
  nxt: NextFunction,
) => {
  try {
    const { uid, currentDate } = req.body;

    const errors = validationResult(req);

    validationErrorParser(errors);

    const user = await UserModel.findById(uid);

    if (!user) {
      throw ValidationError.USER_NOT_FOUND;
    }

    await UserModel.findByIdAndUpdate(uid, { lastChangedPassword: currentDate });

    res.status(200).json(currentDate);
  } catch (error) {
    nxt(error);
    return res.status(400).json({
      error,
    });
  }
};

export const getAllTeamAccounts = async (
  req: Request<Record<string, never>, Record<string, never>, UserIdRequestBody>,
  res: Response,
  nxt: NextFunction,
) => {
  try {
    const { uid } = req.body;

    const user = await UserModel.findById(uid);
    if (!user) {
      throw ValidationError.USER_NOT_FOUND;
    }

    if (user.accountType !== "admin") {
      throw ValidationError.UNAUTHORIZED_USER;
    }

    const allTeamAccounts = await UserModel.find({ accountType: "team" });

    return res.status(200).json(allTeamAccounts);
  } catch (error) {
    nxt(error);
    return res.status(400).json({
      error,
    });
  }
};

export const editAccountType = async (
  req: Request<Record<string, never>, Record<string, never>, UpdateAccountTypeRequestBody>,
  res: Response,
  nxt: NextFunction,
) => {
  try {
    const { uid, updateUserId } = req.body;

    const user = await UserModel.findById(uid);
    const updatedUser = await UserModel.findById(updateUserId);
    if (!user || !updatedUser) {
      throw ValidationError.USER_NOT_FOUND;
    }

    if (user.accountType !== "admin") {
      throw ValidationError.UNAUTHORIZED_USER;
    }

    const updatedUserAdmin = await UserModel.findByIdAndUpdate(updateUserId, {
      accountType: "admin",
    });

    return res.status(200).json(updatedUserAdmin);
  } catch (error) {
    nxt(error);
    return res.status(400).json({
      error,
    });
  }
};

export const editArchiveStatus = async (
  req: Request<Record<string, never>, Record<string, never>, UpdateAccountTypeRequestBody>,
  res: Response,
  nxt: NextFunction,
) => {
  try {
    const { uid, updateUserId } = req.body;

    const user = await UserModel.findById(uid);
    const updatedUser = await UserModel.findById(updateUserId);
    if (!user || !updatedUser) {
      throw ValidationError.USER_NOT_FOUND;
    }

    if (updatedUser.accountType === "admin") {
      throw ValidationError.UNAUTHORIZED_USER;
    }

    if (user.accountType !== "admin") {
      throw ValidationError.UNAUTHORIZED_USER;
    }

    // Disable Firebase account to prevent login
    await firebaseAdminAuth.updateUser(updateUserId, { disabled: true });

    const updatedUserAdmin = await UserModel.findByIdAndUpdate(updateUserId, { archived: true });

    return res.status(200).json(updatedUserAdmin);
  } catch (error) {
    nxt(error);
    return res.status(400).json({
      error,
    });
  }
};
