export type Contact = {
  lastName: string;
  firstName: string;
  email: string;
  phoneNumber: string;
};

export type StudentData = {
  student: Contact;
  emergency: Contact;
  serviceCoordinator: Contact;
  location: string;
  medication: string;
  birthday: string;
  intakeDate: string;
  tourDate: string;
  prog1: string[];
  prog2: string[];
  dietary: string[];
  otherString: string;
};

export type StudentFormData = {
  student_name: string;
  student_last: string;
  student_email: string;
  student_password: string;
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
  birthdate: string;
  medication: string;
  dietary: string[];
  other: string;
  intake_date: string;
  tour_date: string;
  regular_programs: string[];
};
