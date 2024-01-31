import mongoose, { Document } from "mongoose";

// // Did not fix lint errors
// export type UserDocument = Partial<
//   {
//     name: string;
//     accountType: "admin" | "team"; // NOTE Also stored on Firebase using Custom Claims
//     approvalStatus: boolean;
//   } & Document
// >;

export type UserDocument = {
  name: string;
  accountType: "admin" | "team"; // NOTE Also stored on Firebase using Custom Claims
  approvalStatus: boolean;
} & Document;

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Set _id to firebaseUid; Linkage between firebase account and user document on MongoDb
  name: { type: String, required: true },
  accountType: { type: String, enum: ["admin", "team"], required: true },
  // approvalStatus: { type: Boolean, default: false },
  approvalStatus: { type: Boolean, required: true },
});

export default mongoose.model<UserDocument>("User", userSchema);
