import { APIResult, GET, handleAPIError } from "@/api/requests";

export type User = {
  uid: string;
  role: 'admin' | 'team';
  approvalStatus: boolean;
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
