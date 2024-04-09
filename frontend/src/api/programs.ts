import { GET, POST, PUT, handleAPIError } from "../api/requests";

import type { APIResult } from "../api/requests";

export type CreateProgramRequest = {
  name: string;
  abbreviation: string;
  type: string;
  daysOfWeek: string[];
  startDate: Date;
  endDate: Date;
  color: string;
  students?: string[];
};

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

export async function getAllPrograms(): Promise<APIResult<[Program]>> {
  try {
    const response = await GET("/program/all");
    const json = (await response.json()) as [Program];
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}
