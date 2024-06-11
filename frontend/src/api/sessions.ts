import { GET, PATCH, POST, handleAPIError } from "../api/requests";

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

export async function getRecentSessions(): Promise<APIResult<[Session]>> {
  try {
    const response = await GET("/session/get");
    const json = (await response.json()) as [Session];
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function getAbsenceSessions(): Promise<APIResult<[AbsenceSession]>> {
  try {
    const response = await GET("/session/getAbsences");
    const json = (await response.json()) as [AbsenceSession];
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function updateSession(session: Session): Promise<APIResult<Session>> {
  try {
    const response = await PATCH(`/session/mark`, session);
    const json = (await response.json()) as Session;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function createAbsenceSession(
  session: AbsenceCreateBody,
): Promise<APIResult<Session>> {
  try {
    const response = await POST(`/session/markAbsence`, session);
    const json = (await response.json()) as Session;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}
