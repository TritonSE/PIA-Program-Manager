import { APIResult, GET, handleAPIError } from "./requests";

type ObjectId = string; // This is a placeholder for the actual ObjectId type

export async function editPhoto(form: FormData): Promise<APIResult<ObjectId>> {
  try {
    // Don't use the POST function from requests.ts because we need to send a FormData object
    const response = await fetch("http://localhost:4000/api/user/editPhoto", {
      method: "POST",
      body: form,
    });

    const json = (await response.json()) as ObjectId;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function getPhoto(photoID: string): Promise<APIResult<ObjectId>> {
  try {
    const response = await GET(`/user/getPhoto/${photoID}`);
    if (response.ok) {
      const blob = await response.blob();

      const objectURL = URL.createObjectURL(blob);

      return { success: true, data: objectURL };
    } else {
      // Handle non-successful response
      throw new Error("Failed to retrieve photo");
    }
  } catch (error) {
    return handleAPIError(error);
  }
}
