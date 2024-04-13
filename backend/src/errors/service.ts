import { CustomError } from "./errors";

const IMAGE_NOT_SAVED =
  "Image was not able to be saved. Be sure to specify that image key is image";
const IMAGE_NOT_FOUND = "Image was not found. Please make sure id passed in route is valid";
const INVALID_MONGO_ID = "Mongo ID was invalid. Please ensure that the id is correct";
const IMAGE_USER_MISMATCH = "Image does not belong to the user";

export class ServiceError extends CustomError {
  static IMAGE_NOT_SAVED = new ServiceError(0, 404, IMAGE_NOT_SAVED);

  static IMAGE_NOT_FOUND = new ServiceError(1, 404, IMAGE_NOT_FOUND);
  static INVALID_MONGO_ID = new ServiceError(2, 404, INVALID_MONGO_ID);
  static IMAGE_USER_MISMATCH = new ServiceError(3, 404, IMAGE_USER_MISMATCH);
}
