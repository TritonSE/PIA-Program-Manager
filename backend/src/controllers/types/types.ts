import { Request } from "express";

export type UserId = {
  uid: string;
};

export type UserIdRequestBody = Request & UserId;

// Add type so that if uploadType is "create", new field imgeId is required
type NewUploadType = {
  uploadType: "new";
  imageId: string;
};

type EditUploadType = {
  uploadType: "edit";
  imageId: never;
};

export type OwnerInfo = {
  ownerId: string;
  ownerType: string;
} & (NewUploadType | EditUploadType);

export type OwnerRequestBody = Request & OwnerInfo;
