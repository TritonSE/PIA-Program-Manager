import mongoose, { Document } from "mongoose";

// email and password stored in Firebase
// name, gender, account type (Admin/Team), and approval status stored in MongoDB

export type UserDocument = {
  name: string;
  gender: string;
  accountType: "admin" | "team";  // TODO Can be stored on Firebase using Custom Claims
  approvalStatus: string; // TODO Should this be restricted to certain values?
  firebaseUid: string;  // Linkage between firebase account and user document on MongoDb
} & Document;

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, required: true },
  accountType: { type: String, enum: ["admin", "team"], required: true },
  approvalStatus: { type: String, required: true },
  firebaseUid: { type: String, required: true },
});

export default mongoose.model<UserDocument>("User", userSchema);
