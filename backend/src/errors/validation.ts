import { CustomError } from "./errors";

const USER_CREATION_UNSUCCESSFUL = "User not created successfully";

export class ValidationError extends CustomError {
  static USER_CREATION_UNSUCCESSFUL = new ValidationError(1, 400, USER_CREATION_UNSUCCESSFUL);
}
