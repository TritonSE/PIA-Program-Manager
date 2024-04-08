import mongoose from "mongoose";

export type programLink = {
  programId: mongoose.Types.ObjectId;
  status: string;
  dateUpdated: Date;
  hoursLeft: number;
};
