import mongoose from "mongoose";

import { SaveImageRequest } from "../controllers/user";
import { ValidationError } from "../errors";
import { ServiceError } from "../errors/service";
import { Image } from "../models/image";
import UserModel from "../models/user";

// Write the type for the request body
type SaveImageRequestBody = {
  previousImageId: string;
  userId: string;
};

export async function saveImage(req: SaveImageRequest) {
  const { previousImageId, userId } = req.body as SaveImageRequestBody;

  try {
    //Update existing image if possible
    if (previousImageId !== "default" && req.file?.buffer) {
      const image = await Image.findById(previousImageId);
      if (!image) {
        throw ServiceError.IMAGE_NOT_FOUND;
      }

      //Verify that the image belongs to the user
      if (image.userId !== userId) {
        throw ServiceError.IMAGE_USER_MISMATCH;
      }

      console.log("Updating an image in the database");
      // Update the image document with new data
      image.buffer = req.file?.buffer;
      image.originalname = req.file?.originalname;
      image.mimetype = req.file?.mimetype;
      image.size = req.file?.size;

      const updatedImage = await image.save();
      return updatedImage._id as mongoose.Types.ObjectId;
    } else {
      // Create new image if there is no previous image
      console.log("Adding a new image to the database");
      const newImage = new Image({
        buffer: req.file?.buffer,
        originalname: req.file?.originalname,
        mimetype: req.file?.mimetype,
        size: req.file?.size,
        userId,
      });

      const savedImage = await newImage.save();
      const user = await UserModel.findById(userId);
      if (!user) {
        throw ValidationError.USER_NOT_FOUND;
      }

      const savedImageId = savedImage._id as mongoose.Types.ObjectId;

      await UserModel.findByIdAndUpdate(userId, { profilePicture: savedImageId });

      return savedImageId;
    }
  } catch (e) {
    console.log(e);
    throw ServiceError.IMAGE_NOT_SAVED;
  }
}

export async function deletePreviousImage(imageId: string): Promise<void> {
  console.info("Deleting previous image from the database");
  if (!imageId) {
    return;
  }

  await Image.findByIdAndDelete(imageId);

  const image = await Image.findById(imageId);
  if (!image) {
    throw ServiceError.IMAGE_NOT_FOUND;
  }
}
