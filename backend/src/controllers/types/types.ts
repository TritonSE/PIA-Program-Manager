import { Request } from "express";

export type UserId = {
  userId: string;
};

export type UserIdRequest = Request & UserId;
