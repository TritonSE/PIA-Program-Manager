import { HydratedDocument } from "mongoose";

import EnrollmentModel from "../models/enrollment";

export type Enrollment = HydratedDocument<typeof EnrollmentModel>;
