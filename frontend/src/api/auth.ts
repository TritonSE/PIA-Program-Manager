import { LoginResult } from "./data";
import { POST } from "./requests";

const register = async (
  userFullName: string,
  registerEmail: string,
  registerPassword: string,
  confirmPassword: string,
  accountType: "admin" | "team",
): Promise<Response> => {
  if (confirmPassword !== registerPassword) {
    throw Error("Passwords do not match.");
  }
  if (userFullName === "") {
    throw Error("Please enter your full name.");
  }
  const response = await POST(
    "http://localhost:4000/api/user/",
    JSON.stringify({
      name: userFullName,
      accountType,
      email: registerEmail,
      password: registerPassword,
    }),
  ).catch((error: Error) => {
    throw error;
  });
  return response;
};

const loginUser = async (loginEmail: string, loginPassword: string): Promise<LoginResult> => {
  console.log(
    JSON.stringify({
      email: loginEmail,
      password: loginPassword,
    }),
  );
  const response = await POST("http://localhost:4000/api/user/login", {
    email: loginEmail,
    password: loginPassword,
  }).catch((error: Error) => {
    throw error;
  });
  return (await response.json()) as LoginResult;
};

export { register, loginUser };
