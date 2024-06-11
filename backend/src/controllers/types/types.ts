import { Request } from "express";

export type UserId = {
  uid: string;
};

export type UserIdRequestBody = Request & UserId;
