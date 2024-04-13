import { CustomError } from "./errors";

const IMAGE_NOT_SAVED =
  "Image was not able to be saved. Be sure to specify that image key is image";

export class ServiceError extends CustomError {
  static IMAGE_NOT_SAVED = new ServiceError(0, 404, IMAGE_NOT_SAVED);
}
