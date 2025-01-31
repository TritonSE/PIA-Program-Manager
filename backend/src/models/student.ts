/**
 * Student schema
 */
import { InferSchemaType, Schema, model } from "mongoose";

const studentSchema = new Schema({
  student: {
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    email: { type: String, required: false, default: "" },
    phoneNumber: { type: String, required: false, default: "" },
  },

  emergency: {
    lastName: { type: String, required: false, default: "" },
    firstName: { type: String, required: false, default: "" },
    email: { type: String, required: false, default: "" },
    phoneNumber: { type: String, required: false, default: "" },
  },

  serviceCoordinator: {
    lastName: { type: String, required: false, default: "" },
    firstName: { type: String, required: false, default: "" },
    email: { type: String, required: false, default: "" },
    phoneNumber: { type: String, required: false, default: "" },
  },

  enrollments: {
    type: [Schema.Types.ObjectId],
    ref: "Enrollment",
    default: [],
    required: false,
  },

  //Address of student
  location: { type: String, required: false, default: "" },

  //String list of medications
  medication: { type: String, required: false, default: "" },

  birthday: { type: Date, required: false, default: null },
  intakeDate: { type: Date, required: false, default: null },
  tourDate: { type: Date, required: false, default: null },

  conservation: { type: Boolean, required: false, default: false },
  UCINumber: { type: String, required: false, default: "" },
  incidentForm: { type: String, required: false, default: "" },
  documents: {
    type: [
      {
        name: { type: String, required: true },
        link: { type: String, required: true },
        markedAdmin: { type: Boolean, required: true, default: false },
      },
    ],
    required: false,
    default: [],
  },
  profilePicture: { type: String, ref: "Image", required: false, default: "default" },

  progressNotes: {
    type: [Schema.Types.ObjectId],
    ref: "ProgressNote",
    default: [],
    required: false,
  },

  //Will contain list of all dietary restrictions
  dietary: { type: [String], required: false, default: [] },
});

type Student = InferSchemaType<typeof studentSchema>;

export default model<Student>("Student", studentSchema);
