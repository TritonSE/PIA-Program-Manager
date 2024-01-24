/**
 * This file contains functions to verify auth tokens and
 * a user roles
 */

import { NextFunction, Request, Response } from "express";

import { AuthError } from "../errors/auth";
import { decodeAuthToken } from "../util/auth";

type RequestBody = {
  uid: string;
  role: string;
};

/**
 * Middleware to verify Auth token and calls next function based on user role
 */
const verifyAuthToken = async (
  req: Request<object, object, RequestBody>,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const token =
    authHeader && authHeader.split(" ")[0] === "Bearer" ? authHeader.split(" ")[1] : null;
  if (!token) {
    return res
      .status(AuthError.TOKEN_NOT_IN_HEADER.status)
      .send(AuthError.TOKEN_NOT_IN_HEADER.displayMessage(true));
  }

  let userInfo;
  try {
    userInfo = await decodeAuthToken(token);
  } catch (e) {
    return res
      .status(AuthError.INVALID_AUTH_TOKEN.status)
      .send(AuthError.INVALID_AUTH_TOKEN.displayMessage(true));
  }

  if (userInfo) {
    req.body.uid = userInfo.user_id as string;
    req.body.role = userInfo.role as string;
    next();
    return;
  }

  return res.status(AuthError.INVALID_AUTH_TOKEN.status).send(AuthError.INVALID_AUTH_TOKEN.message);
};

export { verifyAuthToken };
