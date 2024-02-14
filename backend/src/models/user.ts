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
});

// userSchema.statics.findByEmail = async function (email: string): Promise<UserDocument | null> {
//   return this.findOne({ email }).exec();
// };

userSchema.statics.findByEmail = async function (email: string): Promise<mongoose.Document | null> {
  return this.findOne({ email }).exec();
};

// type User = InferSchemaType<typeof userSchema>;
type User = InferSchemaType<typeof userSchema> & typeof userSchema.statics;

export default mongoose.model<User>("User", userSchema);
