import { DELETE, GET, POST, PUT, createAuthHeader, handleAPIError } from "../api/requests";
import { StudentData as CreateStudentRequest } from "../components/StudentForm/types";

import type { APIResult } from "../api/requests";

export type Student = CreateStudentRequest & {
  _id: string;
  progressNotes?: string[];
  UCINumber?: string;
  conservation?: boolean;
  profilePicture: string;
};

type EditStudentRequest = {
  _id: string;
} & Partial<Student>;

export async function createStudent(
  student: CreateStudentRequest,
  firebaseToken: string,
): Promise<APIResult<Student>> {
  try {
    const headers = createAuthHeader(firebaseToken);
    const response = await POST("/student/create", student, headers);
    const json = (await response.json()) as Student;
    console.log({ json });
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function editStudent(
  student: EditStudentRequest,
  firebaseToken: string,
): Promise<APIResult<Student>> {
  try {
    const headers = createAuthHeader(firebaseToken);
    const response = await PUT(`/student/edit/${student._id}`, student, headers);
    const json = (await response.json()) as Student;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function getAllStudents(firebaseToken: string): Promise<APIResult<[Student]>> {
  try {
    const headers = createAuthHeader(firebaseToken);
    const response = await GET("/student/all", headers);
    const json = (await response.json()) as [Student];
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function getStudent(id: string, firebaseToken: string): Promise<APIResult<Student>> {
  try {
    const headers = createAuthHeader(firebaseToken);
    const response = await GET(`/student/${id}`, headers);
    const json = (await response.json()) as Student;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function deleteStudent(
  id: string,
  firebaseToken: string,
): Promise<APIResult<Student>> {
  try {
    const headers = createAuthHeader(firebaseToken);
    const response = await DELETE(`/student/${id}`, undefined, headers);
    const json = (await response.json()) as Student;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}
