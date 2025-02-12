import mongoose, { InferSchemaType } from "mongoose";

const enrollmentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
    unique: false,
  },
  programId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Program",
    required: true,
    unique: false,
  },
  status: { type: String, required: true },
  dateUpdated: { type: Date, required: true, default: Date.now() },
  hoursLeft: { type: Number, required: true },
  schedule: { type: [String], required: true },
  sessionTime: {
    type: {
      start_time: { type: String, required: false, default: "00:00" },
      end_time: { type: String, required: false, default: "00:00" },
    },
    required: false,
    default: { start_time: "00:00", end_time: "00:00" },
  },
  startDate: { type: Date, required: true },
  renewalDate: { type: Date, required: true },
  authNumber: { type: String, required: true },
});

type Enrollment = InferSchemaType<typeof enrollmentSchema>;

export default mongoose.model<Enrollment>("Enrollment", enrollmentSchema);
