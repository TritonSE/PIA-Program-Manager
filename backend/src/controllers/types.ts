import { Request } from "express";

export type CreateUserRequestBody = {
  name: string;
  accountType: "admin" | "team";
  email: string;
  password: string;
};

export type LoginUserRequestBody = {
  uid: string;
};

type UserId = {
  userId: string;
};

export type UserIdRequest = Request & UserId;

export type EditNameRequestBody = {
  newName: string;
};

export type EditEmailRequestBody = UserId & {
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
