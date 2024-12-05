import { GET, createAuthHeader, handleAPIError } from "../api/requests";

import type { APIResult } from "../api/requests";

export type CalendarResponse = {
  studentId: string;
  programId: string;
  calendar: {
    date: Date;
    hours: number;
    session: string;
  }[];
};

export async function getCalendar(
  studentId: string,
  programId: string,
  firebaseToken: string,
): Promise<APIResult<CalendarResponse>> {
  try {
    const headers = createAuthHeader(firebaseToken);
    const response = await GET(`/calendar/${studentId}/${programId}`, headers);
    const json = (await response.json()) as CalendarResponse;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}
