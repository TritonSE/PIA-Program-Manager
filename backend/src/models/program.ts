import { InferSchemaType, Schema, model } from "mongoose";

const programSchema = new Schema({
  name: { type: String, required: true },
  abbreviation: { type: String, required: true }, // e.g. ENTR
  type: { type: String, required: true }, // regular vs. varying
  daysOfWeek: { type: [String], required: true }, // M, T, W, TH, F
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  color: { type: String, required: true },
  studentUIDs: { type: [String], required: true },
  renewalDate: { type: Date, required: true },
  hourlyPay: { type: Number, required: true },
  sessions: { type: [[String]], required: true },
});

type ProgramForm = InferSchemaType<typeof programSchema>;

export default model<ProgramForm>("ProgramForm", programSchema);
