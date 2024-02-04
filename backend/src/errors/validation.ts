import { CustomError } from "../errors";

export class ValidationError extends CustomError {
  constructor(message: string) {
    super(0, 400, "VALIDATION ERROR: " + message);
  }
}
