/**
 * Student schema
 */
import { InferSchemaType, Schema, model } from "mongoose";

const studentSchema = new Schema({
  student: {
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  },

  emergency: {
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  },

  serviceCoordinator: {
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  },

  enrollments: {
    type: [Schema.Types.ObjectId],
    ref: "Enrollment",
    default: [],
    required: false,
  },

  //Address of student
  location: { type: String, required: true },

  //String list of medications
  medication: { type: String, required: true },

  birthday: { type: Date, required: true },
  intakeDate: { type: Date, required: true },
  tourDate: { type: Date, required: true },

  conservation: { type: Boolean, required: true },
  UCINumber: { type: String, required: true },
  incidentForm: { type: String, required: true },
  documents: { type: [String], required: true },
  profilePicture: { type: Schema.Types.ObjectId, ref: "Image", required: false },
  progressNotes: {
    type: [Schema.Types.ObjectId],
    ref: "ProgressNote",
    default: [],
    required: false,
  },

  //Will contain list of all dietary restrictions
  dietary: { type: [String] },
});

type Student = InferSchemaType<typeof studentSchema>;

export default model<Student>("Student", studentSchema);
