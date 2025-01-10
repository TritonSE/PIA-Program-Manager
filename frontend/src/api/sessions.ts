import { GET, PATCH, POST, createAuthHeader, handleAPIError } from "../api/requests";

import type { APIResult } from "../api/requests";

export type Session = {
  programId: string;
  date: Date;
  sessionTime: {
    start_time: string;
    end_time: string;
  };
  students: {
    studentId: string;
    attended: boolean;
    hoursAttended: number;
  }[];
  marked: boolean;
  isAbsenceSession: boolean;
};

export type AbsenceSession = {
  programId: string;
  studentId: string;
};

export type AbsenceCreateBody = {
  programId: string;
  date: Date;
  student: {
    studentId: string;
    attended: boolean;
    hoursAttended: number;
  };
};

export async function getRecentSessions(firebaseToken: string): Promise<APIResult<[Session]>> {
  try {
    const headers = createAuthHeader(firebaseToken);
    const response = await GET("/session/get", headers);
    const json = (await response.json()) as [Session];
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function getAbsenceSessions(
  firebaseToken: string,
): Promise<APIResult<[AbsenceSession]>> {
  try {
    const headers = createAuthHeader(firebaseToken);
    const response = await GET("/session/getAbsences", headers);
    const json = (await response.json()) as [AbsenceSession];
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function updateSession(
  session: Session,
  firebaseToken: string,
): Promise<APIResult<Session>> {
  try {
    const headers = createAuthHeader(firebaseToken);
    const response = await PATCH(`/session/mark`, session, headers);
    const json = (await response.json()) as Session;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function createAbsenceSession(
  session: AbsenceCreateBody,
  firebaseToken: string,
): Promise<APIResult<Session>> {
  try {
    const headers = createAuthHeader(firebaseToken);
    const response = await POST(`/session/markAbsence`, session, headers);
    const json = (await response.json()) as Session;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}
