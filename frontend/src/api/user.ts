import { APIResult, GET, PATCH, handleAPIError } from "@/api/requests";

export type User = {
  _id: string;
  name: string;
  accountType: "admin" | "team";
  approvalStatus: boolean;
  email: string;
  profilePicture: string;
  lastChangedPassword: Date;
  archived: boolean;
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

export async function getAllTeamAccounts(firebaseToken: string): Promise<APIResult<User[]>> {
  try {
    const headers = createAuthHeader(firebaseToken);
    const response = await GET(`/user/getAllTeamAccounts`, headers);

    const json = (await response.json()) as User[];
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function editAccountType(
  updateUserId: string,
  firebaseToken: string,
): Promise<APIResult<User>> {
  try {
    const updateAccountData = { updateUserId };
    const headers = createAuthHeader(firebaseToken);
    const response = await PATCH(`/user/editAccountType`, updateAccountData, headers);

    const json = (await response.json()) as User;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function editArchiveStatus(
  updateUserId: string,
  firebaseToken: string,
): Promise<APIResult<User>> {
  try {
    const headers = createAuthHeader(firebaseToken);
    const response = await PATCH(`/user/editArchiveStatus`, { updateUserId }, headers);

    const json = (await response.json()) as User;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}
