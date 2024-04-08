import { GET, POST, PUT, handleAPIError } from "../api/requests";
import { Contact, StudentData } from "../components/StudentForm/types";

import type { APIResult } from "../api/requests";

export type CreateStudentRequest = StudentData;

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

export async function createStudent(student: CreateStudentRequest): Promise<APIResult<Student>> {
  try {
    const response = await POST("/student/create", student);
    const json = (await response.json()) as Student;
    console.log({ json });
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function editStudent(student: Student): Promise<APIResult<Student>> {
  try {
    const response = await PUT(`/student/edit/${student._id}`, student);
    const json = (await response.json()) as Student;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function getAllStudents(): Promise<APIResult<[Student]>> {
  try {
    const response = await GET("/student/all");
    const json = (await response.json()) as [Student];
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}
