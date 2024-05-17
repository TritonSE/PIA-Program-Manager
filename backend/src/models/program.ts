import { InferSchemaType, Schema, model } from "mongoose";

const programSchema = new Schema({
  name: { type: String, required: true },
  abbreviation: { type: String, required: true }, // e.g. ENTR, should be unique
  type: { type: String, required: true }, // regular vs. varying
  daysOfWeek: { type: [String], required: true }, // M, T, W, TH, F
  color: { type: String, required: true },
  hourlyPay: { type: Number, required: true },
  sessions: { type: [[String]], required: true },
  archived: { type: Boolean, required: false },
});

type Program = InferSchemaType<typeof programSchema>;

export default model<Program>("Program", programSchema);
