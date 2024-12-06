/**
 * Functions that process image route requests.
 */

import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

import { InternalError } from "../errors";
import { ServiceError } from "../errors/service";
import { ValidationError } from "../errors/validation";
import { Image } from "../models/image";
import StudentModel from "../models/student";
import UserModel from "../models/user";
import { handleImageParsing } from "../util/image";

import { OwnerRequestBody } from "./types/types";
import { EditPhotoRequestBody } from "./types/userTypes";

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
  req: Request<Record<string, never>, Record<string, never>, OwnerRequestBody>,
  res: Response,
  nxt: NextFunction,
) => {
  try {
    const { ownerId, ownerType, imageId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(imageId)) {
      return res
        .status(ValidationError.INVALID_MONGO_ID.status)
        .send({ error: ValidationError.INVALID_MONGO_ID.message });
    }

    let owner = null;

    if (ownerType === "user") {
      owner = await UserModel.findById(ownerId);
    } else if (ownerType === "student") {
      owner = await StudentModel.findById(ownerId);
    }

    if (!owner) {
      throw ValidationError.USER_NOT_FOUND;
    }

    const image = await Image.findById(imageId);
    if (!image) {
      throw ValidationError.IMAGE_NOT_FOUND;
    }

    if (image.ownerId !== ownerId) {
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
