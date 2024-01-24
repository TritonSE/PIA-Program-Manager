import mongoose, { Document } from "mongoose";

export type UserDocument = {
  name: string;
  gender: string;
  accountType: "admin" | "team"; // NOTE Also stored on Firebase using Custom Claims
  approvalStatus: boolean;
} & Document;

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },  // Set _id to firebaseUid; Linkage between firebase account and user document on MongoDb
  name: { type: String, required: true },
  gender: { type: String, required: true },
  accountType: { type: String, enum: ["admin", "team"], required: true },
  approvalStatus: { type: Boolean, required: true },
});

export default mongoose.model<UserDocument>("User", userSchema);
