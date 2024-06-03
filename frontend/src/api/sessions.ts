import { GET, PATCH, handleAPIError } from "../api/requests";
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

export async function updateSession(session: Session): Promise<APIResult<Session>> {
  try {
    const response = await PATCH(`/session/mark`, session);
    const json = (await response.json()) as Session;
    console.log({ json });
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}