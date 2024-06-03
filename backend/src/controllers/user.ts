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

import {
  CreateUserRequestBody,
  EditEmailRequestBody,
  EditLastChangedPasswordRequestBody,
  EditNameRequestBody,
  EditPhotoRequest,
  LoginUserRequestBody,
  UserIdRequest,
} from "./types";

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
      // profilePicture default "default" in User constructor
      // lastChangedPassword default Date.now() in User constructor
      // approvalStatus default false in User constructor
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    nxt(error);
  }

  return;
};

// export const deleteUser = async (req: Request, res: Response, nxt: NextFunction) => {
//   try {
//     const { userId } = req.params;

//     if (!userId || typeof userId !== "string" || userId.trim().length === 0) {
//       throw new Error("Invalid userId provided");
//     }

//     // console.log('Received userId:', userId);
//     // console.log('Type of userId:', typeof userId);
//     // console.log('Length of userId:', userId.length);

//     // delete user from Firebase and MongoDB
//     await deleteUserFromFirebase(userId);
//     await deleteUserFromMongoDB(userId);

//     res.status(200).send("User deleted successfully");
//   } catch (error) {
//     console.error("Error deleting user:", error);
//     nxt(error);
//   }
// };

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

// export const approveUser = async (req: Request, res: Response, nxt: NextFunction) => {
//   try {
//     const { userId, email } = req.body; // firebaseuid and email

//     await UserModel.findByIdAndUpdate(userId, { approvalStatus: true });

//     // await sendApprovalEmail(email);
//     await sendApprovalEmail(email as string);

//     res.status(200).send("User approved successfully");
//   } catch (error) {
//     console.error(error);
//     nxt(error);
//   }
// };

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

// export const denyUser = async (req: Request, res: Response, nxt: NextFunction) => {
//   try {
//     const { userId, email } = req.body; // firebaseuid and email

//     await UserModel.findByIdAndUpdate(userId, { approvalStatus: false });

//     // await sendDenialEmail(email);
//     await sendDenialEmail(email as string);

//     res.status(200).send("User denied successfully");
//   } catch (error) {
//     console.error(error);
//     nxt(error);
//   }
// };

export const denyUser = async (req: Request, res: Response, nxt: NextFunction) => {
  console.log("Inside denyUser controller");

  try {
    console.log("denyUser controller : 1");

    const { email } = req.body;

    console.log("Email from request body:", email);

    console.log("denyUser controller : 2");

    const user = await UserModel.findOne({ email });

    console.log("denyUser controller : 3");

    if (!user) {
      console.log("Inside !user if statement");

      return res.status(404).send("User not found");
    }

    console.log("User object:", user);

    console.log("denyUser controller : 4");

    const userId = user._id;

    await UserModel.findByIdAndUpdate(userId, { approvalStatus: false });

    console.log("denyUser controller : 5");

    console.log("About to send denial email");
    console.log(email as string);
    // await sendDenialEmail(email);
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
    res.status(200).json({
      uid: user._id,
      role: user.accountType,
      approvalStatus: user.approvalStatus,
      profilePicture: user.profilePicture,
      name: user.name,
      email: user.email,
      lastChangedPassword: user.lastChangedPassword,
    });
    return;
  } catch (e) {
    nxt();
    console.log(e);
    return res.status(400).json({
      error: e,
    });
  }
};

export const editPhoto = (req: Request, res: Response, nxt: NextFunction) => {
  try {
    const customReq = req as EditPhotoRequest;

    //Validation logic inside handleImageParsing
    handleImageParsing(customReq, res, nxt);
  } catch (e) {
    console.log(e);
    nxt(e);
  }
};

export const getPhoto = async (req: Request, res: Response, nxt: NextFunction) => {
  try {
    const customReq = req as UserIdRequest;
    const imageId = req.params.id;
    const userId = customReq.userId;
    if (!mongoose.Types.ObjectId.isValid(imageId)) {
      return res
        .status(ValidationError.INVALID_MONGO_ID.status)
        .send({ error: ValidationError.INVALID_MONGO_ID.message });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      throw ValidationError.USER_NOT_FOUND;
    }

    const image = await Image.findById(imageId);
    if (!image) {
      throw ValidationError.IMAGE_NOT_FOUND;
    }

    if (image.userId !== userId) {
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

export const editName = async (req: Request, res: Response, nxt: NextFunction) => {
  try {
    const customReq = req as UserIdRequest;
    const { newName } = customReq.body as EditNameRequestBody;
    const userId = customReq.userId;

    const errors = validationResult(customReq);

    validationErrorParser(errors);

    const user = await UserModel.findById(userId);

    if (!user) {
      throw ValidationError.USER_NOT_FOUND;
    }

    await UserModel.findByIdAndUpdate(userId, { name: newName });

    res.status(200).json(newName);
  } catch (error) {
    nxt(error);
    return res.status(400).json({
      error,
    });
  }
};

export const editEmail = async (req: Request, res: Response, nxt: NextFunction) => {
  try {
    const customReq = req as UserIdRequest;
    const { newEmail } = customReq.body as EditEmailRequestBody;
    const userId = customReq.userId;

    const errors = validationResult(customReq);

    validationErrorParser(errors);

    await firebaseAdminAuth.updateUser(userId, { email: newEmail });

    const user = await UserModel.findById(userId);

    if (!user) {
      throw ValidationError.USER_NOT_FOUND;
    }

    await UserModel.findByIdAndUpdate(userId, { email: newEmail });

    return res.status(200).json(newEmail);
  } catch (error) {
    nxt(error);
  }
};

export const editLastChangedPassword = async (req: Request, res: Response, nxt: NextFunction) => {
  try {
    const customReq = req as UserIdRequest;
    const { currentDate } = customReq.body as EditLastChangedPasswordRequestBody;
    const userId = customReq.userId;

    const errors = validationResult(req);

    validationErrorParser(errors);

    const user = await UserModel.findById(userId);

    if (!user) {
      throw ValidationError.USER_NOT_FOUND;
    }

    await UserModel.findByIdAndUpdate(userId, { lastChangedPassword: currentDate });

    res.status(200).json(currentDate);
  } catch (error) {
    nxt(error);
    return res.status(400).json({
      error,
    });
  }
};
