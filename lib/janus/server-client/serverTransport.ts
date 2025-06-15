import { BaseResponse } from "@/proto/janus/core/core_pb";
import { createConnectTransport } from "@connectrpc/connect-web";
import { cookies } from "next/headers";
import { keysToSnake } from "@/lib/utils";

export const serverTransport = createConnectTransport({
  baseUrl: "http://api.devspace.local:31500",
  jsonOptions: {},
  fetch: fetchJanus,
});

export class ServiceError extends Error {
  constructor(
    public code: string,
    message?: string,
  ) {
    super(message ?? `Service returned error code ${code}`);
    this.name = "ServiceError";
  }
}

function safeBigIntToNumber(val: bigint): number | string {
  return val <= Number.MAX_SAFE_INTEGER ? Number(val) : val.toString();
}

async function fetchJanus(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  console.log("Fetch URL:", input);
  console.log("Fetch init:", init);

  let body: BodyInit | null | undefined = init?.body;
  let processedBody: BodyInit | null | undefined = body;

  // Handle Uint8Array body
  if (body instanceof Uint8Array) {
    try {
      // Convert Uint8Array to string
      const jsonString = new TextDecoder().decode(body);
      console.log("Fetch string body:", jsonString);

      // Parse JSON and convert keys to snake_case
      const jsonObj = JSON.parse(jsonString, (key, value) => {
        // Convert stringified numbers back to numbers
        // if (typeof value === "string" && /^\d+$/.test(value)) {
        //   const num = Number(value);
        //   return num.toString() === value ? num : value;
        // }
        return value;
      });
      const snakeObj = keysToSnake(jsonObj);
      const snakeJson = JSON.stringify(snakeObj);

      console.log("Fetch snake‑cased body:", snakeJson);
      processedBody = snakeJson;
    } catch (error) {
      console.error("Error processing Uint8Array body:", error);
      // Fallback to original body if processing fails
      processedBody = body;
    }
  } else if (typeof body === "string") {
    try {
      console.log("Fetch string body:", body);

      // Parse JSON and convert keys to snake_case
      const jsonObj = JSON.parse(body, (key, value) => {
        // Convert stringified numbers back to numbers
        // if (typeof value === "string" && /^\d+$/.test(value)) {
        //   const num = Number(value);
        //   return num.toString() === value ? num : value;
        // }
        return value;
      });
      const snakeObj = keysToSnake(jsonObj);
      const snakeJson = JSON.stringify(snakeObj);

      console.log("Fetch snake‑cased body:", snakeJson);
      processedBody = snakeJson;
    } catch (error) {
      console.error("Error processing string body:", error);
      // Fallback to original body if processing fails
      processedBody = body;
    }
  } else {
    // For other body types (FormData, Blob, etc.), use as-is
    processedBody = body;
  }

  const cookie = await cookies();
  const cookieHeader = cookie.toString();

  const response = await fetch(input, {
    ...init,
    body: processedBody,
    headers: {
      ...init?.headers,
      "Content-Type": "application/json",
      Accept: "application/json",
      Cookie: cookieHeader,
    },
    credentials: "include",
  });

  console.log("Response status:", response.status);

  if (!response.ok) {
    console.error("Fetch error:", response.statusText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  try {
    const responseData = await response.clone().json();
    const base = responseData.base as BaseResponse;

    if (base?.code !== "00") {
      console.error("Error in response:", base.code);
      throw new ServiceError(base.code, base.desc);
    }

    return response;
  } catch (error) {
    console.error("Error parsing response:", error);
    return response;
  }
}
