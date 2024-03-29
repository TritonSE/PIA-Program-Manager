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

  //Address of student
  location: { type: String, required: true },

  //String list of medications
  medication: { type: String, required: true },

  birthday: { type: Date, required: true },
  intakeDate: { type: Date, required: true },
  tourDate: { type: Date, required: true },

  //For now, chose to express these as a list of strings. Will probably be replaced with
  //program subdocs in the future once they have been defined
  regularPrograms: { type: [String], required: true },
  varyingPrograms: { type: [String], required: true },

  //Will contain list of all dietary restrictions
  dietary: { type: [String] },

  otherString: { type: String, default: "" },
});

type Student = InferSchemaType<typeof studentSchema>;

export default model<Student>("Student", studentSchema);
