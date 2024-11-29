/**
 * This file contains functions to verify auth tokens and
 * a user roles
 */

import { NextFunction, Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/auth";

import { AuthError } from "../errors/auth";
import { decodeAuthToken } from "../util/auth";

type RequestBody = {
  uid: string;
  accountType: string;
};

type RequestWithUserId = Request<object, object, RequestBody> & {
  userId?: string;
};

/**
 * Middleware to verify Auth token and calls next function based on user role
 */
const verifyAuthToken = async (req: RequestWithUserId, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token =
    authHeader && authHeader.split(" ")[0] === "Bearer" ? authHeader.split(" ")[1] : null;
  if (!token) {
    return res
      .status(AuthError.TOKEN_NOT_IN_HEADER.status)
      .send(AuthError.TOKEN_NOT_IN_HEADER.displayMessage(true));
  }

  let userInfo: DecodedIdToken;
  try {
    userInfo = await decodeAuthToken(token);
  } catch (e) {
    return res
      .status(AuthError.INVALID_AUTH_TOKEN.status)
      .send(AuthError.INVALID_AUTH_TOKEN.displayMessage(true));
  }

  if (userInfo) {
    req.body.uid = userInfo.user_id as string;
    req.body.accountType = userInfo.accountType as string;
    next();
    return;
  }

  return res.status(AuthError.INVALID_AUTH_TOKEN.status).send(AuthError.INVALID_AUTH_TOKEN.message);
};

export { verifyAuthToken };
