import mongoose, { Document } from "mongoose";

export type UserDocument = {
  name: string;
  gender: string;
  accountType: "admin" | "team"; // NOTE Also stored on Firebase using Custom Claims
  approvalStatus: boolean;
  firebaseUid: string; // Linkage between firebase account and user document on MongoDb
} & Document;

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, required: true },
  accountType: { type: String, enum: ["admin", "team"], required: true },
  approvalStatus: { type: Boolean, required: true },
  firebaseUid: { type: String, required: true },
});

export default mongoose.model<UserDocument>("User", userSchema);
