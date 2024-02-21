import { GET, POST, PUT, handleAPIError } from "../api/requests";
import { Contact, StudentData } from "../components/StudentForm/types";

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
  regularPrograms: string[];
  varyingPrograms: string[];
  dietary: string[];
  otherString?: string;
};

export type CreateStudentRequest = StudentData;

export type StudentJSON = {
  _id: string;
  student: Contact;
  emergency: Contact;
  serviceCoordinator: Contact;
  location: string;
  medication?: string;
  birthday: Date;
  intakeDate: Date;
  tourDate: Date;
  regularPrograms: string[];
  varyingPrograms: string[];
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
    birthday: studentJSON.birthday,
    intakeDate: studentJSON.intakeDate,
    tourDate: studentJSON.tourDate,
    regularPrograms: studentJSON.regularPrograms,
    varyingPrograms: studentJSON.varyingPrograms,
    dietary: studentJSON.dietary,
    otherString: studentJSON.otherString,
  } as Student;
}

export async function createStudent(student: CreateStudentRequest): Promise<APIResult<Student>> {
  try {
    const response = await POST("/student/create", student);
    const json = (await response.json()) as StudentJSON;
    return { success: true, data: parseStudent(json) };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function editStudent(student: StudentJSON): Promise<APIResult<Student>> {
  try {
    const response = await PUT(`/student/edit/${student._id}`, student);
    const json = (await response.json()) as StudentJSON;
    return { success: true, data: parseStudent(json) };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function getAllStudents(): Promise<APIResult<[StudentJSON]>> {
  try {
    const response = await GET("/student/all");
    const json = (await response.json()) as [StudentJSON];
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}
