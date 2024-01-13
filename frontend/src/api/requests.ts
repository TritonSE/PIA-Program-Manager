/**
 *
 */

/**
 *
 */
type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 *
 * @param response
 * @returns
 */
async function assertOK(response: Response): Promise<void> {
  if (response.ok) {
    return;
  }

  let message = `${response.status} ${response.statusText}`;

  const text = await response.text();
  if (text) {
    message += `: ${text}`;
  }

  throw new Error(message);
}

/**
 *
 * @param method
 * @param url
 * @param body
 * @param headers
 * @returns
 */
async function fetchRequest(
  method: Method,
  url: string,
  body: unknown,
  headers: Record<string, string>,
): Promise<Response> {
  const newHeaders = { ...headers };
  if (body !== undefined) {
    newHeaders["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    method,
    headers: newHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  await assertOK(response);

  return response;
}

/**
 *
 * @param url
 * @param headers
 * @returns
 */
export async function GET(url: string, headers: Record<string, string> = {}): Promise<Response> {
  return await fetchRequest("GET", url, undefined, headers);
}

/**
 *
 * @param url
 * @param body
 * @param headers
 * @returns
 */
export async function POST(
  url: string,
  body: unknown,
  headers: Record<string, string> = {},
): Promise<Response> {
  return await fetchRequest("POST", url, body, headers);
}

/**
 *
 * @param url
 * @param body
 * @param headers
 * @returns
 */
export async function PUT(
  url: string,
  body: unknown,
  headers: Record<string, string> = {},
): Promise<Response> {
  return await fetchRequest("PUT", url, body, headers);
}

/**
 *
 * @param url
 * @param body
 * @param headers
 * @returns
 */
export async function PATCH(
  url: string,
  body: unknown,
  headers: Record<string, string> = {},
): Promise<Response> {
  return await fetchRequest("PATCH", url, body, headers);
}

/**
 *
 * @param url
 * @param body
 * @param headers
 * @returns
 */
export async function DELETE(
  url: string,
  body: unknown,
  headers: Record<string, string> = {},
): Promise<Response> {
  return await fetchRequest("DELETE", url, body, headers);
}

/**
 *
 */
export type APIData<T> = { success: true; data: T };
/**
 *
 */
export type APIError = { success: false; error: string };
/**
 *
 */
export type APIResult<T> = APIData<T> | APIError;

/**
 *
 * @param error
 * @returns
 */
export function handleAPIError(error: unknown): APIError {
  if (error instanceof Error) {
    return { success: false, error: error.message };
  } else if (typeof error === "string") {
    return { success: false, error };
  }
  return { success: false, error: `Unknown error; ${String(error)}` };
}
