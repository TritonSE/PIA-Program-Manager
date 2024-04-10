import { ValidationChain, body } from "express-validator";
import mongoose from "mongoose";

import { ValidationError } from "../errors";

export const createUser: ValidationChain[] = [
  body("name")
    .notEmpty()
    .withMessage("Body cannot be empty.")
    .isString()
    .withMessage("Invaid name format."),
  body("accountType")
    .notEmpty()
    .withMessage("accountType cannot be empty.")
    .isIn(["admin", "team"])
    .withMessage("Invaid accountType."),
  body("email")
    .notEmpty()
    .withMessage("Email cannot be empty.")
    .isEmail()
    .withMessage("Invaid email."),
  body("password")
    .notEmpty()
    .withMessage("Password cannot be empty.")
    .isString()
    .withMessage("Invalid password format.")
    .isLength({ min: 6 })
    .withMessage("Invaid password length (>6)."),
];

export const loginUser: ValidationChain[] = [
  body("uid")
    .notEmpty()
    .withMessage("Email cannot be empty.")
    .isEmail()
    .withMessage("Invalid email format."),
  body("password")
    .notEmpty()
    .withMessage("Email cannot be empty.")
    .isString()
    .withMessage("Invalid password format."),
];

type MulterFile = {
  mimetype: string;
  size: number;
};

export const editPhoto = [
  // Validate that the "image" field is being used in the form data
  body("image").custom((value, { req }) => {
    const file = req.file as MulterFile;
    if (!file) {
      throw ValidationError.IMAGE_NOT_UPLOADED;
    }

    const acceptableTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!acceptableTypes.includes(file.mimetype)) {
      throw ValidationError.IMAGE_UNSUPPORTED_TYPE;
    }

    // Check file size (2MB limit)
    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) {
      throw ValidationError.IMAGE_EXCEED_SIZE;
    }

    return true;
  }),
  body("userId").isString().notEmpty().withMessage("User ID is required."),
  body("previousImageId")
    .custom((value: string) => value === "default" || mongoose.Types.ObjectId.isValid(value))
    .withMessage("Mongo ID format is invalid"),
];

export const getPhoto: ValidationChain[] = [
  body("imageId")
    .exists()
    .withMessage("ID is required")
    .bail()
    .custom((value: string) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Mongo ID format is invalid"),
];

export const editName: ValidationChain[] = [
  body("newName")
    .exists()
    .withMessage("New name is required")
    .notEmpty()
    .withMessage("Image id cannot be empty")
    .isString(),
  body("userId").exists().withMessage("User ID is required").bail().notEmpty(),
];

export const editEmail: ValidationChain[] = [
  body("newEmail")
    .exists()
    .withMessage("New email is required")
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isEmail()
    .withMessage("Invalid email format"),
  body("userId").exists().withMessage("User ID is required").bail().notEmpty(),
];

export const editLastChangedPassword: ValidationChain[] = [
  body("currentDate")
    .exists()
    .withMessage("Current date is required")
    .notEmpty()
    .withMessage("Date cannot be empty")
    .isISO8601()
    .withMessage("Invalid Date format"),
  body("userId").exists().withMessage("User ID is required").bail().notEmpty(),
];
