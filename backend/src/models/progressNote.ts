import { InferSchemaType, Schema, model } from "mongoose";

const progressNoteSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  userId: { type: String, ref: "User", required: true },
  lastEditedBy: { type: String, required: true },
  dateLastUpdated: { type: Date, required: true },
  content: { type: String, required: true },
});

type ProgressNote = InferSchemaType<typeof progressNoteSchema>;

export default model<ProgressNote>("ProgressNotes", progressNoteSchema);
