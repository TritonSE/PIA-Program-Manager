export type Contact = {
  lastName: string;
  firstName: string;
  email: string;
  phoneNumber: string;
};

export type ProgramLink = {
  programId: string;
  status: string;
  dateUpdated: Date;
  hoursLeft: number;
};

export type StudentData = {
  _id?: string;
  student: Contact;
  emergency: Contact;
  serviceCoordinator: Contact;
  location: string;
  medication: string;
  birthday: Date;
  intakeDate: Date;
  tourDate: Date;
  conservation: boolean;
  UCINumber: string;
  incidentForm: string;
  documents: string[];
  profilePicture: string;
  enrollments: Enrollment[];
};

export type StudentFormData = {
  studentName: string;
  studentLast: string;
  studentEmail: string;
  studentPhone: string;
  emergencyName: string;
  emergencyLast: string;
  emergencyEmail: string;
  emergencyPhone: string;
  serviceCoordinatorName: string;
  serviceCoordinatorLast: string;
  serviceCoordinatorEmail: string;
  serviceCoordinatorPhone: string;
  address: string;
  birthdate: Date;
  medication: string;
  other: string;
  intakeDate: Date;
  tourDate: Date;
  conservation: string;
  UCINumber: string;
  incidentForm: string;
  documents: string[];
  profilePicture: string;
  regularEnrollments: EnrollmentFormEntry[];
  varyingEnrollments: EnrollmentFormEntry[];
};

export type Enrollment = {
  studentId: string;
  programId: string;
  status: string;
  dateUpdated: Date;
  hoursLeft: number;
  schedule: string[];
  sessionTime: {
    start_time: string;
    end_time: string;
  };
  startDate: Date;
  renewalDate: Date;
  authNumber: string;
};

export type EnrollmentFormEntry = Omit<Enrollment, "startDate" | "renewalDate"> & {
  startDate: string;
  renewalDate: string;
  varying: boolean;
};

// get [XX:YY, ZZ:AA] -> form interprets starting time and uses string
// XX:YY AM - ZZ:AA PM
// when we modify the session time on the form we update the resulting string
// make request to backed with [XX:YY, ZZ:AA] as the session time

export enum StatusOptions {
  Joined = "Joined",
  Waitlisted = "Waitlisted",
  Archived = "Archived",
  NotAFit = "Not a fit",
  Completed = "Completed",
}
