import { InferSchemaType, Schema, model } from "mongoose";

const programSchema = new Schema({
  name: { type: String, required: true },
  abbreviation: { type: String, required: true }, // e.g. ENTR, should be unique
  type: { type: String, required: true }, // regular vs. varying
  daysOfWeek: { type: [String], required: true }, // M, T, W, TH, F
  color: { type: String, required: true },
  hourlyPay: { type: Number, required: true },
  sessions: {
    type: [
      {
        start_time: { type: String, required: true },
        end_time: { type: String, required: true },
      },
    ],
    required: true,
  },
});

type Program = InferSchemaType<typeof programSchema>;

export default model<Program>("Program", programSchema);
