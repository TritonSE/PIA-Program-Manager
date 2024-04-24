import { APIResult, POST, handleAPIError } from "@/api/requests";
import { ProgressNote } from "@/components/ProgressNotes/types";

export const createAuthHeader = (firebaseToken: string) => ({
  Authorization: `Bearer ${firebaseToken}`,
});

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
    console.log({ json });
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}
