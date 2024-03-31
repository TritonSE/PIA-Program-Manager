import { GET, handleAPIError } from "../api/requests";

import type { APIResult } from "../api/requests";

export type Program = {
  _id: string;
  name: string;
  abbreviation: string;
  type: string;
  daysOfWeek: [string];
  startDate: Date;
  endDate: Date;
  color: string;
};

export async function getAllStudents(): Promise<APIResult<[Program]>> {
  try {
    const response = await GET("/program/all");
    const json = (await response.json()) as [Program];
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}
