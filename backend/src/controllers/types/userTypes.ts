import { Request } from "express";

import { OwnerInfo, UserId } from "./types";

export type CreateUserRequestBody = {
  name: string;
  accountType: "admin" | "team";
  email: string;
  password: string;
};

export type LoginUserRequestBody = {
  uid: string;
};

export type EditNameRequestBody = UserId & {
  newName: string;
};

export type EditEmailRequestBody = UserId & {
  newEmail: string;
};

export type EditLastChangedPasswordRequestBody = UserId & {
  currentDate: string;
};

export type UpdateAccountTypeRequestBody = UserId & {
  updateUserId: string;
};

export type SaveImageRequest = {
  body: {
    previousImageId: string;
    ownerId: string;
    ownerType: string;
    uploadType: string;
    imageId: string;
  };
  file: {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
  };
};

export type EditPhotoRequestBody = Request<
  Record<string, never>,
  Record<string, never>,
  OwnerInfo
> & {
  rawBody?: Buffer;
};
