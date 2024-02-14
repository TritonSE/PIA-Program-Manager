import { POST, handleAPIError } from "../api/requests";
import { Contact, StudentFormData } from "../components/StudentForm/types";

import type { APIResult } from "../api/requests";

export type Student = {
  _id: string;
  student: Contact;
  emergency: Contact;
  serviceCoordinator: Contact;
  location: string;
  medication?: string;
  birthday: Date;
  intakeDate: Date;
  tourDate: Date;
  regular_programs: string[];
  varying_programs: string[];
  dietary: string[];
  otherString?: string;
};

export type CreateStudentRequest = StudentFormData;

type StudentJSON = {
  _id: string;
  student: Contact;
  emergency: Contact;
  serviceCoordinator: Contact;
  location: string;
  medication?: string;
  birthday: string;
  intakeDate: string;
  tourDate: string;
  regular_programs: string[];
  varying_programs: string[];
  dietary: string[];
  otherString?: string;
};

function parseStudent(studentJSON: StudentJSON): Student {
  return {
    _id: studentJSON._id,
    student: studentJSON.student,
    emergency: studentJSON.emergency,
    serviceCoordinator: studentJSON.serviceCoordinator,
    location: studentJSON.location,
    medication: studentJSON.medication,
    birthday: new Date(studentJSON.birthday),
    intakeDate: new Date(studentJSON.intakeDate),
    tourDate: new Date(studentJSON.tourDate),
    regular_programs: studentJSON.regular_programs,
    varying_programs: studentJSON.varying_programs,
    dietary: studentJSON.dietary,
    otherString: studentJSON.otherString,
  } as Student;
}

export async function createStudent(student: CreateStudentRequest): Promise<APIResult<Student>> {
  try {
    const response = await POST("/student", student);
    const json = (await response.json()) as StudentJSON;
    return { success: true, data: parseStudent(json) };
  } catch (error) {
    return handleAPIError(error);
  }
}
