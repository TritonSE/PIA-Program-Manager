//modified from onboarding repo for program form backend

import { InferSchemaType, Schema, model } from "mongoose";

const programSchema = new Schema({
  name: { type: String, required: true },
  abbreviation: { type: String, required: true }, // e.g. ENTR
  type: { type: String, required: true }, // regular vs. varying
  daysOfWeek: { type: [String], required: true }, // M, T, W, TH, F
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  color: { type: String, required: true }, // options: 1 (teal, #4FA197), 2 (yellow, #FFB800), 3 (pink, #FF7A5E), 4 (olive, #B6BF0E)
  students: { type: [Schema.Types.ObjectId], ref: "Student", required: false },
});

type ProgramForm = InferSchemaType<typeof programSchema>;

export default model<ProgramForm>("ProgramForm", programSchema);
