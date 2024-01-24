import { CustomError } from "./errors";

const USER_CREATION_UNSUCCESSFUL = "User not created successfully";

export class UserError extends CustomError {
  static USER_CREATION_UNSUCCESSFUL = new UserError(0, 400, USER_CREATION_UNSUCCESSFUL);
}
