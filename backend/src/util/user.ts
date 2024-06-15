import UserModel from "../models/user";

import { firebaseAdminAuth } from "./firebase";

// delete user from Firebase
export const deleteUserFromFirebase = async (userId: string): Promise<void> => {
  await firebaseAdminAuth.deleteUser(userId);
};

// delete user from MongoDB
export const deleteUserFromMongoDB = async (userId: string): Promise<void> => {
  await UserModel.findByIdAndDelete(userId);
};
