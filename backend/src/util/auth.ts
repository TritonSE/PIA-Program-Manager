/**
 * This file consists of functions to be used to add
 * users to Firebase. Could potentially be configured to add
 * neccessary user info to Mongo DB (i.e uid linking user from
 * firebase to MongoDB)
 */

import { AuthError } from "../errors/auth";

import { firebaseAdminAuth } from "./firebase";

/**
 * This function verifies a token and returns a user from firebase.
 * @param token - the auth token of the user
 * @returns
 */
async function decodeAuthToken(token: string) {
  try {
    const userInfo = await firebaseAdminAuth.verifyIdToken(token);
    return userInfo;
  } catch (e) {
    throw AuthError.DECODE_ERROR;
  }
}

export { decodeAuthToken };
