import { Schema } from "mongoose";

export type ProgressNoteType = {
  studentId: Schema.Types.ObjectId;
  userId: string;
  lastEditedBy: string;
  dateLastUpdated: Date;
  content: string;
};

export type ExistingProgressNoteType = {
  _id: Schema.Types.ObjectId;
  userId: string;
  lastEditedBy: string;
  dateLastUpdated: Date;
  content: string;
};

export type CreateProgressNoteRequestBody = {
  studentId: Schema.Types.ObjectId;
  uid: string;
  dateLastUpdated: Date;
  content: string;
};

export type EditProgressNoteRequestBody = {
  _id: Schema.Types.ObjectId;
  uid: string;
  dateLastUpdated: Date;
  content: string;
};

export type DeleteProgressNoteRequestBody = {
  noteId: Schema.Types.ObjectId;
  studentId: Schema.Types.ObjectId;
};
