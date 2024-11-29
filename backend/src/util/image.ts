import busboy from "busboy";
import { NextFunction, Response } from "express";
import mongoose from "mongoose";

import { OwnerInfo } from "../controllers/types/types";
import { EditPhotoRequestBody, SaveImageRequest } from "../controllers/types/userTypes";
import { ValidationError } from "../errors";
import { ServiceError } from "../errors/service";
import { Image } from "../models/image";
import StudentModel from "../models/student";
import UserModel from "../models/user";

// Write the type for the request body
type SaveImageRequestBody = {
  previousImageId: string;
} & OwnerInfo;

async function saveImage(req: SaveImageRequest) {
  const { previousImageId, ownerId, ownerType } = req.body as SaveImageRequestBody;

  try {
    //Update existing image if possible
    if (previousImageId !== "default" && req.file?.buffer) {
      const image = await Image.findById(previousImageId);
      if (!image) {
        throw ValidationError.IMAGE_NOT_FOUND;
      }

      //Verify that the image belongs to the user
      if (image.ownerId !== ownerId) {
        throw ValidationError.IMAGE_USER_MISMATCH;
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
        ownerId,
        ownerType,
      });

      const savedImage = await newImage.save();
      let owner = null;

      if (ownerType === "user") {
        owner = await UserModel.findById(ownerId);
      } else if (ownerType === "student") {
        owner = await StudentModel.findById(ownerId);
      }

      if (!owner) {
        throw ValidationError.USER_NOT_FOUND;
      }

      const savedImageId = savedImage._id as mongoose.Types.ObjectId;

      if (ownerType === "user") {
        await UserModel.findByIdAndUpdate(ownerId, { profilePicture: savedImageId });
      } else if (ownerType === "student") {
        await StudentModel.findByIdAndUpdate(ownerId, { profilePicture: savedImageId });
      }

      return savedImageId;
    }
  } catch (e) {
    console.log(e);
    throw ServiceError.IMAGE_NOT_SAVED;
  }
}

export function handleImageParsing(req: EditPhotoRequestBody, res: Response, nxt: NextFunction) {
  let previousImageId = "";
  let ownerId = "";
  let ownerType = "";

  const bb = busboy({ headers: req.headers });

  let fileBuffer = Buffer.alloc(0);
  bb.on("field", (fieldname, val) => {
    if (fieldname === "previousImageId") {
      previousImageId = val;
    }
    if (fieldname === "ownerId") {
      ownerId = val;
    }
    if (fieldname === "ownerType") {
      ownerType = val;
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
            ownerId,
            ownerType,
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

  if (req.rawBody) {
    bb.end(req.rawBody);
  } else {
    req.pipe(bb);
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
    throw ValidationError.IMAGE_NOT_FOUND;
  }
}
