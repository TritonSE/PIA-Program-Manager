import {
  APIResult,
  DELETE,
  GET,
  POST,
  PUT,
  createAuthHeader,
  handleAPIError,
} from "@/api/requests";
import { ProgressNote } from "@/components/ProgressNotes/types";

export async function createProgressNote(
  studentId: string,
  dateLastUpdated: Date,
  content: string,
  firebaseToken: string,
): Promise<APIResult<ProgressNote>> {
  try {
    const headers = createAuthHeader(firebaseToken);
    const progressNote = { studentId, dateLastUpdated, content };
    const response = await POST("/progressNote/create", progressNote, headers);
    const json = (await response.json()) as ProgressNote;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function editProgressNote(
  noteId: string,
  dateLastUpdated: Date,
  content: string,
  firebaseToken: string,
): Promise<APIResult<ProgressNote>> {
  try {
    const headers = createAuthHeader(firebaseToken);
    const progressNote = { _id: noteId, dateLastUpdated, content };
    const response = await PUT("/progressNote/edit", progressNote, headers);
    const json = (await response.json()) as ProgressNote;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function deleteProgressNote(
  noteId: string,
  studentId: string,
  firebaseToken: string,
): Promise<APIResult<ProgressNote>> {
  try {
    const headers = createAuthHeader(firebaseToken);
    const progressNote = { noteId, studentId };
    const response = await DELETE("/progressNote/delete", progressNote, headers);
    const json = (await response.json()) as ProgressNote;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function getAllProgressNotes(
  firebaseToken: string,
): Promise<APIResult<ProgressNote[]>> {
  try {
    const headers = createAuthHeader(firebaseToken);
    const response = await GET("/progressNote/all", headers);
    const json = (await response.json()) as ProgressNote[];
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}
