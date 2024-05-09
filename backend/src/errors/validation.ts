import { CustomError } from "./errors";

const USER_CREATION_UNSUCCESSFUL = "User not created successfully";
const USER_NOT_FOUND = "User not found in database";
const STUDENT_NOT_FOUND = "Student not found in database";
const IMAGE_EXCEED_SIZE = "Image size exceeds 3MB limit";
const IMAGE_UNSUPPORTED_TYPE = "Invalid file type. Only JPG, PNG, and WEBP are allowed.";
const IMAGE_NOT_UPLOADED = "Image not uploaded successfully";
const IMAGE_NOT_FOUND = "Image was not found. Please make sure id passed in route is valid";
const INVALID_MONGO_ID = "Mongo ID was invalid. Please ensure that the id is correct";
const IMAGE_USER_MISMATCH = "Image does not belong to the user";
const PROGRESS_NOTE_NOT_FOUND = "Progress note not found in database";

export class ValidationError extends CustomError {
  static USER_CREATION_UNSUCCESSFUL = new ValidationError(1, 400, USER_CREATION_UNSUCCESSFUL);
  static USER_NOT_FOUND = new ValidationError(2, 404, USER_NOT_FOUND);
  static STUDENT_NOT_FOUND = new ValidationError(3, 404, STUDENT_NOT_FOUND);
  static IMAGE_EXCEED_SIZE = new ValidationError(4, 400, IMAGE_EXCEED_SIZE);
  static IMAGE_UNSUPPORTED_TYPE = new ValidationError(5, 400, IMAGE_UNSUPPORTED_TYPE);
  static IMAGE_NOT_UPLOADED = new ValidationError(6, 400, IMAGE_NOT_UPLOADED);
  static IMAGE_NOT_FOUND = new ValidationError(7, 404, IMAGE_NOT_FOUND);
  static INVALID_MONGO_ID = new ValidationError(8, 404, INVALID_MONGO_ID);
  static IMAGE_USER_MISMATCH = new ValidationError(9, 404, IMAGE_USER_MISMATCH);
  static PROGRESS_NOTE_NOT_FOUND = new ValidationError(10, 404, PROGRESS_NOTE_NOT_FOUND);
}
