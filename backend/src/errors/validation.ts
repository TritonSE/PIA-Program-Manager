import { CustomError } from "./errors";

const USER_CREATION_UNSUCCESSFUL = "User not created successfully";
const USER_NOT_FOUND = "User not found in database";

export class ValidationError extends CustomError {
  constructor(code: number, status: number, message: string) {
    super(code, status, "VALIDATION ERROR: " + message);
  }
  static USER_CREATION_UNSUCCESSFUL = new ValidationError(1, 400, USER_CREATION_UNSUCCESSFUL);
  static USER_NOT_FOUND = new ValidationError(1, 400, USER_NOT_FOUND);
}
