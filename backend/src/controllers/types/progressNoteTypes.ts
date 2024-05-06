import { Schema } from "mongoose";

export type ProgressNoteType = {
  studentId: Schema.Types.ObjectId;
  userId: string;
  lastEditedBy: string;
  dateLastUpdated: Date;
  content: string;
};

export type CreateProgressNoteRequestBody = {
  studentId: string;
  date: string;
  note: string;
};
