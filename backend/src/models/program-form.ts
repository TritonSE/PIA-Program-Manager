//modified from onboarding repo for program form backend

import { InferSchemaType, Schema, model } from "mongoose";

const programFormSchema = new Schema({
  name: { type: String, required: true },
  abbreviation: { type: String, required: true }, // e.g. ENTR
  type: { type: String, required: true }, // regular vs. varying
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  color: { type: Number, enum: [1, 2, 3, 4], required: true }, // options: 1 (teal, #4FA197), 2 (yellow, #FFB800), 3 (pink, #FF7A5E), 4 (olive, #B6BF0E)
});

type ProgramForm = InferSchemaType<typeof programFormSchema>;

export default model<ProgramForm>("ProgramForm", programFormSchema);
