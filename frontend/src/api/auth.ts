import { POST } from "./requests";
import { type User } from "./data";

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
    "http://localhost:3001/user/",
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

const loginUser = async (loginPassword: string, loginEmail: string): Promise<Response> => {
  const response = await POST(
    "http://localhost:3001/user/login",
    JSON.stringify({
      email: loginEmail,
      password: loginPassword,
    }),
  ).catch((error: Error) => {
    throw error;
  });
  return response;
};

const getUser = async (email: string): Promise<User | null> => {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };
  const requestLink = "http://localhost:3001/user/";
  const response = await fetch(requestLink.concat(email), requestOptions);
  if (response.status === 404) {
    return null;
  }
  return (await response.json()) as User;
};

export { register, loginUser };
