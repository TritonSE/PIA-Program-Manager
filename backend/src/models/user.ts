import mongoose, { InferSchemaType } from "mongoose";

// export type UserDocument = {
//   name: string;
//   accountType: "admin" | "team"; // NOTE Also stored on Firebase using Custom Claims
//   approvalStatus: boolean;
// };

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Set _id to firebaseUid; Linkage between firebase account and user document on MongoDb
  name: { type: String, required: true },
  accountType: { type: String, enum: ["admin", "team"], required: true },
  approvalStatus: { type: Boolean, default: false }, // default false
  email: { type: String, required: true },
  profilePicture: { type: String, required: false, default: "default" },
  lastChangedPassword: { type: Date, required: false, default: Date.now() },
  archived: { type: Boolean, required: false, default: false },
});

type User = InferSchemaType<typeof userSchema>;

export default mongoose.model<User>("User", userSchema);
