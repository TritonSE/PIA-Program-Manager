/**
 * Based on https://github.com/TritonSE/ALUM-Mobile-Application/blob/feature/philip/edit-profile-view/backend/src/models/image.ts
 * This file contains the model to store image metadata.
 * Note that images require refactoring via the multer package
 */

import mongoose from "mongoose";

type ImageInterface = {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
  userId: string;
};

type ImageDoc = mongoose.Document & {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
  userId: string;
};

type ImageModelInterface = mongoose.Model<ImageDoc> & {
  build(attr: ImageInterface): ImageDoc;
};

const imageSchema = new mongoose.Schema({
  buffer: {
    type: Buffer,
    requried: true,
  },
  originalname: {
    type: String,
    required: true,
  },
  mimetype: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

const Image = mongoose.model<ImageDoc, ImageModelInterface>("Image", imageSchema);

export { Image, imageSchema };
