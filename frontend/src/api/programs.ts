import { GET, PATCH, POST, handleAPIError } from "../api/requests";
import { CreateProgramRequest } from "../components/ProgramForm/types";

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

export async function createProgram(program: CreateProgramRequest): Promise<APIResult<Program>> {
  try {
    const response = await POST("/program/create", program);
    const json = (await response.json()) as Program;
    console.log({ json });
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function getProgram(id: string): Promise<APIResult<Program>> {
  try {
    const response = await GET(`/program/${id}`);
    const json = (await response.json()) as Program;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function getProgramEnrollments(id: string): Promise<APIResult<[Enrollment]>> {
  try {
    const response = await GET(`/program/enrollments/${id}`);
    const json = (await response.json()) as [Enrollment];
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function editProgram(program: Program): Promise<APIResult<Program>> {
  try {
    const response = await PATCH(`/program/${program._id}`, program);
    const json = (await response.json()) as Program;
    console.log({ json });
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function getAllPrograms(): Promise<APIResult<[Program]>> {
  try {
    const response = await GET("/program/all");
    const json = (await response.json()) as [Program];
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function archiveProgram(program: Program): Promise<APIResult<Program>> {
  try {
    const response = await POST(`/program/archive/${program._id}`, undefined);
    const json = (await response.json()) as Program;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}
