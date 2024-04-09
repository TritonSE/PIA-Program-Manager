import { ValidationChain, body } from "express-validator";

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
      throw new Error("Image file is required");
    }

    const acceptableTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!acceptableTypes.includes(file.mimetype)) {
      throw new Error("Invalid file type. Only JPG, PNG, and WEBP are allowed.");
    }

    // Check file size (2MB limit)
    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error("File size too large. The limit is 3MB.");
    }

    return true;
  }),
];
