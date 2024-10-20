/**
 * Absence session schema
 */
import { InferSchemaType, Schema, model } from "mongoose";

const sessionSchema = new Schema({
  programId: { type: Schema.Types.ObjectId, ref: "Program", required: true },
  studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
});

type AbsenceSession = InferSchemaType<typeof sessionSchema>;

export default model<AbsenceSession>("AbsenceSession", sessionSchema);
