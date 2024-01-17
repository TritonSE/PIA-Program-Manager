/**
 * Student schema
 */
import { InferSchemaType, Schema, model } from "mongoose";

const studentSchema = new Schema({
  student: {
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
  },

  emergency: {
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
  },

  serviceCoordinator: {
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
  },

  //Address of student
  location: { type: String, required: true },

  //String list of medications
  medication: { type: String, required: true },

  birthday: { type: Date, required: true },
  intakeDate: { type: Date, required: true },
  tourDate: { type: Date, required: true },

  //For now, chose to express these as strings. Will probably be replaced with
  //program subdocs in the future once they have been defined
  prog1: { type: String, required: true },
  prog2: { type: String },

  //Clunky but functional for the time being
  dietary: {
    nuts: { type: Boolean, default: false },
    eggs: { type: Boolean, default: false },
    seafood: { type: Boolean, default: false },
    pollen: { type: Boolean, default: false },
    dairy: { type: Boolean, default: false },
    other: { type: Boolean, default: false },
  },

  otherString: String,
});

type Student = InferSchemaType<typeof studentSchema>;

export default model<Student>("Student", studentSchema);
