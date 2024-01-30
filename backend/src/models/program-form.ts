/**
 * Program schema
 */
import { InferSchemaType, Schema, model } from "mongoose";

const programSchema = new Schema({
  //name of program
  name: { type: String, required: true },
  //abbreviation of program (e.g. ENTR)
  abbreviation: { type: String, required: true },
  //type of program (e.g. regular)
  type: { type: String, required: true },
  //start date
  startDate: { type: Date, required: true },
  //end date
  endDate: { type: Date, required: true },
  //color (e.g. #FFFFFF)
  color: { type: String, required: true },
});

type Program = InferSchemaType<typeof programSchema>;

export default model<Program>("Program", programSchema);
