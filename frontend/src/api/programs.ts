import { GET, PATCH, POST, handleAPIError } from "../api/requests";
import { CreateProgramRequest } from "../components/ProgramForm/types";

import { createAuthHeader } from "./progressNotes";

import type { APIResult } from "../api/requests";

export type Program = CreateProgramRequest & { _id: string; dateUpdated: string };

export type Enrollment = {
  _id: string;
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
  required: true;
  startDate: Date;
  renewalDate: Date;
  authNumber: string;
};

export async function createProgram(
  program: CreateProgramRequest,
  firebaseToken: string,
): Promise<APIResult<Program>> {
  try {
    const headers = createAuthHeader(firebaseToken);
    const response = await POST("/program/create", program, headers);
    const json = (await response.json()) as Program;
    console.log({ json });
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function getProgram(id: string, firebaseToken: string): Promise<APIResult<Program>> {
  try {
    const headers = createAuthHeader(firebaseToken);
    const response = await GET(`/program/${id}`, headers);
    const json = (await response.json()) as Program;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function getProgramEnrollments(
  id: string,
  firebaseToken: string,
): Promise<APIResult<[Enrollment]>> {
  try {
    const headers = createAuthHeader(firebaseToken);
    const response = await GET(`/program/enrollments/${id}`, headers);
    const json = (await response.json()) as [Enrollment];
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function editProgram(
  program: Program,
  firebaseToken: string,
): Promise<APIResult<Program>> {
  try {
    const headers = createAuthHeader(firebaseToken);
    const response = await PATCH(`/program/${program._id}`, program, headers);
    const json = (await response.json()) as Program;
    console.log({ json });
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function getAllPrograms(firebaseToken: string): Promise<APIResult<[Program]>> {
  try {
    const headers = createAuthHeader(firebaseToken);
    const response = await GET("/program/all", headers);
    const json = (await response.json()) as [Program];
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function archiveProgram(
  program: Program,
  firebaseToken: string,
): Promise<APIResult<Program>> {
  try {
    const headers = createAuthHeader(firebaseToken);
    const response = await POST(`/program/archive/${program._id}`, undefined, headers);
    const json = (await response.json()) as Program;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}
