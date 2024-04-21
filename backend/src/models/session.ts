/**
 * Session schema
 */
import { InferSchemaType, Schema, model } from "mongoose";

const sessionSchema = new Schema({
  programId: { type: Schema.Types.ObjectId, ref: "Program", required: true },
  date: { type: Date, required: true },
  students: {
    type: [
      {
        studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
        attended: { type: Boolean, required: true },
        hoursAttended: { type: Number, required: true },
      },
    ],
    required: true,
  },
});

type Session = InferSchemaType<typeof sessionSchema>;

export default model<Session>("Session", sessionSchema);
