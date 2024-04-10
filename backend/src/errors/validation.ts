import { CustomError } from "./errors";

const USER_CREATION_UNSUCCESSFUL = "User not created successfully";
const USER_NOT_FOUND = "User not found in database";
const IMAGE_EXCEED_SIZE = "Image size exceeds 3MB limit";
const IMAGE_UNSUPPORTED_TYPE = "Invalid file type. Only JPG, PNG, and WEBP are allowed.";
const IMAGE_NOT_UPLOADED = "Image not uploaded successfully";


export class ValidationError extends CustomError {
  static USER_CREATION_UNSUCCESSFUL = new ValidationError(1, 400, USER_CREATION_UNSUCCESSFUL);
  static USER_NOT_FOUND = new ValidationError(1, 400, USER_NOT_FOUND);
  static IMAGE_EXCEED_SIZE = new ValidationError(1, 400, IMAGE_EXCEED_SIZE);
  static IMAGE_UNSUPPORTED_TYPE = new ValidationError(1, 400, IMAGE_UNSUPPORTED_TYPE);
  static IMAGE_NOT_UPLOADED = new ValidationError(1, 400, IMAGE_NOT_UPLOADED);

}
