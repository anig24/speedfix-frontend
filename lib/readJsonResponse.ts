export type JsonObject = Record<string, unknown>;

export async function readJsonResponse<T = JsonObject>(
  response: Response
): Promise<T> {
  const text = await response.text();

  if (!text.trim()) {
    return {} as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return {
      error: response.ok
        ? "The server returned an invalid JSON response."
        : "The server returned an invalid error response.",
    } as T;
  }
}
