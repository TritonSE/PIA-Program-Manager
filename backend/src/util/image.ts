import { Request } from "express";
import mongoose from "mongoose";

import { ServiceError } from "../errors/service";
import { Image } from "../models/image";

export async function saveImage(req: Request): Promise<mongoose.Types.ObjectId> {
  console.info("Adding an image to the datatbase");

  const image = new Image({
    buffer: req.file?.buffer,
    originalname: req.file?.originalname,
    mimetype: req.file?.mimetype,
    size: req.file?.size,
  });
  try {
    const newImage = await image.save();
    return newImage._id as mongoose.Types.ObjectId;
  } catch (e) {
    console.log(e);
    throw ServiceError.IMAGE_NOT_SAVED;
  }
}
