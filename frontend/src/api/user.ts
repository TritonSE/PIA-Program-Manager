import { APIResult, GET, PATCH, handleAPIError } from "@/api/requests";

export type User = {
  _id: string;
  uid: string;
  role: string;
  profilePicture: string;
  name: string;
  email: string;
  lastChangedPassword: Date;
};

export const createAuthHeader = (firebaseToken: string) => ({
  Authorization: `Bearer ${firebaseToken}`,
});

export const verifyUser = async (firebaseToken: string): Promise<APIResult<User>> => {
  try {
    const response = await GET("/user", createAuthHeader(firebaseToken));
    const json = (await response.json()) as User;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
};

type ObjectId = string; // This is a placeholder for the actual ObjectId type
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";
export async function editPhoto(
  form: FormData,
  previousImageId: string,
  userId: string,
): Promise<APIResult<ObjectId>> {
  try {
    form.append("previousImageId", previousImageId);
    form.append("userId", userId);

    // Don't use the POST function from requests.ts because we need to send a FormData object
    const response = await fetch(`${API_BASE_URL}/user/editPhoto`, {
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
