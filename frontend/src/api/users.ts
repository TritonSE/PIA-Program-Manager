import { APIResult, GET, PATCH, handleAPIError } from "./requests";

type ObjectId = string; // This is a placeholder for the actual ObjectId type

export async function editPhoto(
  form: FormData,
  previousImageId: string,
  userId: string,
): Promise<APIResult<ObjectId>> {
  try {
    form.append("previousImageId", previousImageId);
    form.append("userId", userId);

    // Don't use the POST function from requests.ts because we need to send a FormData object
    const response = await fetch("http://localhost:4000/api/user/editPhoto", {
      method: "POST",
      body: form,
    });

    if (response.ok) {
      const json = (await response.json()) as ObjectId;
      return { success: true, data: json };
    } else {
      const json = (await response.json()) as { error: string };
      throw new Error(json.error);
    }
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function getPhoto(imageId: string): Promise<APIResult<ObjectId>> {
  try {
    const response = await GET(`/user/getPhoto/${imageId}`);
    if (response.ok) {
      const blob = await response.blob();

      const objectURL = URL.createObjectURL(blob);

      return { success: true, data: objectURL };
    } else {
      throw new Error("Failed to retrieve photo");
    }
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function editName(newName: string, userId: string): Promise<APIResult<ObjectId>> {
  try {
    const nameData = { newName, userId };
    const response = await PATCH(`/user/editName`, nameData);

    const json = (await response.json()) as string;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function editEmail(newEmail: string, userId: string): Promise<APIResult<ObjectId>> {
  try {
    const nameData = { newEmail, userId };
    const response = await PATCH(`/user/editEmail`, nameData);

    if (response.ok) {
      const json = (await response.json()) as string;
      return { success: true, data: json };
    } else {
      const json = (await response.json()) as { error: string };
      throw new Error(json.error);
    }
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function editLastChangedPassword(userId: string): Promise<APIResult<ObjectId>> {
  try {
    const dateData = { currentDate: new Date(Date.now()), userId };
    const response = await PATCH(`/user/editLastChangedPassword`, dateData);

    const json = (await response.json()) as string;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}
