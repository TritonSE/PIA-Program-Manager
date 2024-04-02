/**
 * Based on the TSE onboarding API client implementation:
 * https://github.com/TritonSE/onboarding/blob/main/frontend/src/api/requests.ts
 */

/**
 * Custom type definition for the HTTP methods handled by this module.
 */
type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

/**
 * Throws an error if the status code of the HTTP response indicates an error. If an HTTP error was
 * raised, throws an error.
 *
 * @param response A `Response` object returned by `fetch()`
 * @throws An `Error` object if the response status was not successful (2xx) or a redirect (3xx)
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
 * Wrapper for the `fetch()` function.
 *
 * @param method The HTTP method (see `Method`)
 * @param url The URL to request from
 * @param body The request body (or undefined, if none)
 * @param headers The request headers
 * @returns A `Response` object returned by `fetch()`
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
 * Sends a GET request to the indicated API URL.
 *
 * @param url The URL to request from
 * @param headers The request headers
 * @returns A `Response` object returned by `fetch()`
 */
export async function GET(url: string, headers: Record<string, string> = {}): Promise<Response> {
  return await fetchRequest("GET", API_BASE_URL + url, undefined, headers);
}

/**
 * Sends a POST request with the provided request body to the indicated API URL.
 *
 * @param url The URL to request from
 * @param body The request body (or undefined, if none)
 * @param headers The request headers
 * @returns A `Response` object returned by `fetch()`
 */
export async function POST(
  url: string,
  body: unknown,
  headers: Record<string, string> = {},
): Promise<Response> {
  return await fetchRequest("POST", API_BASE_URL + url, body, headers);
}

/**
 * Sends a PUT request with the provided request body to the indicated API URL.
 *
 * @param url The URL to request from
 * @param body The request body (or undefined, if none)
 * @param headers The request headers
 * @returns A `Response` object returned by `fetch()`
 */
export async function PUT(
  url: string,
  body: unknown,
  headers: Record<string, string> = {},
): Promise<Response> {
  return await fetchRequest("PUT", API_BASE_URL + url, body, headers);
}

/**
 * Sends a PATCH request with the provided request body to the indicated API URL.
 *
 * @param url The URL to request from
 * @param body The request body (or undefined, if none)
 * @param headers The request headers
 * @returns A `Response` object returned by `fetch()`
 */
export async function PATCH(
  url: string,
  body: unknown,
  headers: Record<string, string> = {},
): Promise<Response> {
  return await fetchRequest("PATCH", API_BASE_URL + url, body, headers);
}

/**
 * Sends a DELETE request with the provided request body to the indicated API URL.
 *
 * @param url The URL to request from
 * @param body The request body (or undefined, if none)
 * @param headers The request headers
 * @returns A `Response` object returned by `fetch()`
 */
export async function DELETE(
  url: string,
  body: unknown,
  headers: Record<string, string> = {},
): Promise<Response> {
  return await fetchRequest("DELETE", API_BASE_URL + url, body, headers);
}

/**
 * Utility type for the result of a successful API result. See `APIResult`.
 */
export type APIData<T> = { success: true; data: T };
/**
 * Utility type for the result of an unsuccessful API result. See `APIResult`.
 */
export type APIError = { success: false; error: string };
/**
 * Utility type for the result of an API request. API client functions should
 * return an object of this type, which allows implementations of the functions
 * to perform more straightforward exception-checking without requiring
 * extensive `try`-`catch` hadnling, making use of TypeScript's type narrowing
 * feature.
 *
 * By checking the value of the `success` field, it can be quickly determined
 * whether the `data` field (containing an actual API response) or the `error`
 * field (containing an error message) should be accessed.
 *
 * Recommended usage:
 *
 * ```
 * if (result.success) {
 *   console.log(result.data);
 * } else {
 *   console.error(result.error);
 * }
 * ```
 */
export type APIResult<T> = APIData<T> | APIError;

/**
 * Helper function for API client functions for consistent error handling.
 *
 * Recommended usage:
 *
 * ```
 * try {
 *   ...
 * } catch (error) {
 *   return handleAPIError(error);
 * }
 * ```
 *
 * @param error The error thrown by a lower-level API function
 * @returns An `APIError` object with a message from the given error
 */
export function handleAPIError(error: unknown): APIError {
  if (error instanceof Error) {
    return { success: false, error: error.message };
  } else if (typeof error === "string") {
    return { success: false, error };
  }
  return { success: false, error: `Unknown error; ${String(error)}` };
}
