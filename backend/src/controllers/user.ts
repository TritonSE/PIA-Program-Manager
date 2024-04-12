import busboy from "busboy";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import admin from "firebase-admin";
import mongoose from "mongoose";

import { InternalError } from "../errors";
import { ServiceError } from "../errors/service";
import { ValidationError } from "../errors/validation";
import { Image } from "../models/image";
import UserModel from "../models/user";
import { firebaseAdminAuth } from "../util/firebase";
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
  uid: string;
};

type UserId = {
  userId: string;
};

type EditNameRequestBody = UserId & {
  newName: string;
};

type EditEmailRequestBody = UserId & {
  newEmail: string;
};

type EditLastChangedPasswordRequestBody = UserId & {
  currentDate: string;
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

export type SaveImageRequest = {
  body: {
    previousImageId: string;
    userId: string;
  };
  file: {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
  };
};

type CustomRequest = Request & {
  userId: string;
  rawBody?: Buffer;
};

export const editPhoto = (req: Request, res: Response, nxt: NextFunction) => {
  try {
    const customReq = req as CustomRequest;
    let previousImageId = "";
    //req.userId is assigned in verifyAuthToken middleware
    const userId: string = customReq.userId;

    const bb = busboy({ headers: req.headers });

    let fileBuffer = Buffer.alloc(0);
    bb.on("field", (fieldname, val) => {
      if (fieldname === "previousImageId") {
        previousImageId = val;
      }
    });
    bb.on("file", (name, file, info) => {
      const { filename, mimeType } = info;

      file
        .on("data", (data) => {
          fileBuffer = Buffer.concat([fileBuffer, data]);
        })
        .on("close", () => {
          const saveImageRequest: SaveImageRequest = {
            body: {
              previousImageId,
              userId,
            },
            file: {
              buffer: fileBuffer,
              originalname: filename,
              mimetype: mimeType,
              size: fileBuffer.length,
            },
          };

          // Validate file in form data
          try {
            const acceptableTypes = ["image/jpeg", "image/png", "image/webp"];
            if (!acceptableTypes.includes(mimeType)) {
              throw ValidationError.IMAGE_UNSUPPORTED_TYPE;
            }

            // Check file size (2MB limit)
            const maxSize = 2 * 1024 * 1024;
            if (fileBuffer.length > maxSize) {
              throw ValidationError.IMAGE_EXCEED_SIZE;
            }

            saveImage(saveImageRequest)
              .then((savedImageId) => {
                res.status(200).json(savedImageId);
              })
              .catch((error) => {
                console.error("Error saving image:", error);
                nxt(error); // Properly forward the error
              });
          } catch (error) {
            console.error("Error parsing form with Busboy:", error);
            nxt(error); // Properly forward the error
          }
        });
    });

    if (customReq.rawBody) {
      bb.end(customReq.rawBody);
    } else {
      customReq.pipe(bb);
    }
  } catch (e) {
    console.log(e);
    nxt(e);
  }
};

export const getPhoto = async (req: Request, res: Response, nxt: NextFunction) => {
  try {
    const imageId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(imageId)) {
      return res
        .status(ServiceError.INVALID_MONGO_ID.status)
        .send({ error: ServiceError.INVALID_MONGO_ID.message });
    }

    const image = await Image.findById(imageId);
    if (!image) {
      throw ServiceError.IMAGE_NOT_FOUND;
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
    const errors = validationResult(req);

    validationErrorParser(errors);

    console.log("test firebase log");

    const { newName, userId } = req.body as EditNameRequestBody;

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
    const errors = validationResult(req);

    validationErrorParser(errors);

    const { newEmail, userId } = req.body as EditEmailRequestBody;

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
    const errors = validationResult(req);

    validationErrorParser(errors);

    const { currentDate, userId } = req.body as EditLastChangedPasswordRequestBody;

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
