import { CustomError } from "./errors";

const NO_APP_PORT = "Could not find app port env variable";
const NO_MONGO_URI = "Could not find mongo uri env variable";
const NO_SERVICE_ACCOUNT_KEY = "Could not find service account key env variable";

export class InternalError extends CustomError {
  static NO_APP_PORT = new InternalError(0, 500, NO_APP_PORT);

  static NO_MONGO_URI = new InternalError(1, 500, NO_MONGO_URI);

  static NO_SERVICE_ACCOUNT_KEY = new InternalError(2, 500, NO_SERVICE_ACCOUNT_KEY);
}
