import { APIResult, DELETE, GET, PATCH, POST, handleAPIError } from "@/api/requests";

export type User = {
  uid: string;
  role: "admin" | "team";
  approvalStatus: boolean;
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

export async function getNotApprovedUsers(): Promise<APIResult<User[]>> {
  try {
    const response = await GET("/user/not-approved");
    const json = (await response.json()) as User[];
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function approveUser(email: string): Promise<APIResult<void>> {
  try {
    const response = await POST(`/user/approve`, { email });
    if (response.ok) {
      // return { success: true };
      return { success: true, data: undefined }; // return APIResult<void> with empty data
    } else {
      const error = await response.json();
      throw new Error(error.message || "Failed to approve user");
    }
  } catch (error) {
    return { success: false, error: "Failed to approve user" };
  }
}

export async function denyUser(email: string): Promise<APIResult<void>> {
  console.log("In frontend/src/api/user.ts denyUser()");

  try {
    const response = await POST(`/user/deny`, { email });
    if (response.ok) {
      // return { success: true };
      return { success: true, data: undefined }; // return APIResult<void> with empty data
    } else {
      const error = await response.json();
      throw new Error(error.message || "Failed to deny user");
    }
  } catch (error) {
    return { success: false, error: "Error denying user" };
  }
}

// delete user by email
export async function deleteUserByEmail(email: string): Promise<APIResult<void>> {
  try {
    const response = await DELETE(`/user/delete/${encodeURIComponent(email)}`, undefined);
    if (response.ok) {
      // return { success: true };
      return { success: true, data: undefined };
    } else {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete user");
    }
  } catch (error) {
    return handleAPIError(error);
  }
}

type ObjectId = string; // This is a placeholder for the actual ObjectId type
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";
export async function editPhoto(
  form: FormData,
  previousImageId: string,
  firebaseToken: string,
): Promise<APIResult<ObjectId>> {
  try {
    form.append("previousImageId", previousImageId);
    const method = "POST";
    const headers = createAuthHeader(firebaseToken);

    // Don't use the POST function from requests.ts because we need to send a FormData object
    const response = await fetch(`${API_BASE_URL}/user/editPhoto`, {
      method,
      body: form,
      headers,
    });

    if (response.ok) {
      const json = (await response.json()) as ObjectId;
      return { success: true, data: json };
    } else {
      const json = (await response.json()) as { error: string };
      console.log(json.error);
      throw new Error(json.error);
    }
  } catch (error) {
    console.log(error);
    return handleAPIError(error);
  }
}

export async function getPhoto(
  imageId: string,
  firebaseToken: string,
): Promise<APIResult<ObjectId>> {
  try {
    const headers = createAuthHeader(firebaseToken);
    const response = await GET(`/user/getPhoto/${imageId}`, headers);
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

export async function editName(
  newName: string,
  firebaseToken: string,
): Promise<APIResult<ObjectId>> {
  try {
    const nameData = { newName };
    const headers = createAuthHeader(firebaseToken);
    const response = await PATCH(`/user/editName`, nameData, headers);

    const json = (await response.json()) as string;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function editEmail(
  newEmail: string,
  firebaseToken: string,
): Promise<APIResult<ObjectId>> {
  try {
    const nameData = { newEmail };
    const headers = createAuthHeader(firebaseToken);
    const response = await PATCH(`/user/editEmail`, nameData, headers);

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

export async function editLastChangedPassword(firebaseToken: string): Promise<APIResult<ObjectId>> {
  try {
    const dateData = { currentDate: new Date(Date.now()) };
    const headers = createAuthHeader(firebaseToken);
    const response = await PATCH(`/user/editLastChangedPassword`, dateData, headers);

    const json = (await response.json()) as string;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}
