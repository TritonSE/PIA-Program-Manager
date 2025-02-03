import { GET, PATCH, createAuthHeader, handleAPIError } from "../api/requests";

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

export async function editCalendar(
  calendar: CalendarResponse,
  firebaseToken: string,
): Promise<APIResult<string>> {
  try {
    const headers = createAuthHeader(firebaseToken);
    const res = await PATCH(`/calendar`, calendar, headers);
    const json = (await res.json()) as string;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}
