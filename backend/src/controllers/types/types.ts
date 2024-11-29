import { Request } from "express";

export type UserId = {
  uid: string;
};

export type UserIdRequestBody = Request & UserId;

export type OwnerInfo = {
  ownerId: string;
  ownerType: string;
};

export type OwnerRequestBody = Request & OwnerInfo & { imageId: string };
