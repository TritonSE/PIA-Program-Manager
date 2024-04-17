import { GET, PATCH, POST, handleAPIError } from "../api/requests";
import { CreateProgramRequest } from "../components/ProgramForm/types";

import type { APIResult } from "../api/requests";

export type Program = CreateProgramRequest & { _id: string; students: string[] };

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
    const response = await GET(`/api/program/${id}`);
    const json = (await response.json()) as Program;
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
