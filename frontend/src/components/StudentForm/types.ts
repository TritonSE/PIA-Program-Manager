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
  conservation: boolean;
  UCINumber: string;
  incidentForm: string;
  documents: string[];
  profilePicture: string;
  enrollments: Enrollment[];
};

export type Enrollment = {
  studentId: string;
  programId: string;
  status: string;
  dateUpdated: Date;
  hoursLeft: number;
  schedule: string;
  sessionTime: string[];
  startDate: Date;
  renewalDate: Date;
  authNumber: string;
};
