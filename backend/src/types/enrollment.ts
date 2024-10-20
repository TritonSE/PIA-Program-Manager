/* eslint-disable @typescript-eslint/no-explicit-any */

import mongoose, { Schema } from "mongoose";

import EnrollmentModel from "../models/enrollment";

// get the enrollment type from the enrollment model
export type Enrollment = Extract<
  typeof EnrollmentModel,
  mongoose.Model<any, any, any>
> extends mongoose.Model<infer U>
  ? U & { _id: Schema.Types.ObjectId }
  : never;
