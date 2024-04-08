export type Contact = {
  lastName: string;
  firstName: string;
  email: string;
  phoneNumber: string;
};

export type ProgramLink = {
  programId: string;
  status: string;
  dateUpdated?: Date;
  hoursLeft: number;
};

export type StudentData = {
  student: Contact;
  emergency: Contact;
  serviceCoordinator: Contact;
  location: string;
  medication?: string;
  birthday: Date;
  intakeDate: Date;
  tourDate: Date;
  regularPrograms: ProgramLink[];
  varyingPrograms: ProgramLink[];
  dietary: string[];
  otherString?: string;
};

export type StudentFormData = {
  student_name: string;
  student_last: string;
  student_email: string;
  student_phone: string;
  emergency_name: string;
  emergency_last: string;
  emergency_email: string;
  emergency_phone: string;
  serviceCoordinator_name: string;
  serviceCoordinator_last: string;
  serviceCoordinator_email: string;
  serviceCoordinator_phone: string;
  address: string;
  birthdate: Date;
  medication: string;
  dietary: string[];
  other: string;
  intake_date: Date;
  tour_date: Date;
  regular_programs: string[];
  varying_programs: string[];
};
