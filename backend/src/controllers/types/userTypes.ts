import { Request } from "express";

import { UserId, UserIdRequest } from "./types";

export type CreateUserRequestBody = {
  name: string;
  accountType: "admin" | "team";
  email: string;
  password: string;
};

export type LoginUserRequestBody = {
  uid: string;
};

export type EditNameRequestBody = {
  newName: string;
};

export type EditEmailRequestBody = UserIdRequest & {
  newEmail: string;
};

export type EditLastChangedPasswordRequestBody = UserId & {
  currentDate: string;
};

export type SaveImageRequest = {
  body: {
    previousImageId: string;
    userId: string;
  };
  file: {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
  };
};

export type EditPhotoRequest = Request &
  UserId & {
    rawBody?: Buffer;
  };
