import EnrollmentModel from "../models/enrollment";
import { Enrollment } from "../types/enrollment";

export const createEnrollment = async (req: Enrollment) => {
  try {
    return await EnrollmentModel.create(req);
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const editEnrollment = async (req: Enrollment) => {
  try {
    console.log(req);
    return await EnrollmentModel.findByIdAndUpdate(req._id, req);
  } catch (e) {
    console.log(e);
    throw e;
  }
};
