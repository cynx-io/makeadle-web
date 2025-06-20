"use client";

import { getJanusBaseUrl } from "@/lib/utils";
import { BaseResponse } from "@/proto/janus/core_pb";
import { createConnectTransport } from "@connectrpc/connect-web";

export const transport = createConnectTransport({
  baseUrl: getJanusBaseUrl(),
  jsonOptions: {
    useProtoFieldName: true,
  },
  fetch: fetchJanus,
});

export class ServiceError extends Error {
  constructor(public code: string, message?: string) {
    super(message ?? `Service returned error code ${code}`);
    this.name = "ServiceError";
  }
}

async function fetchJanus(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  console.log("Fetch URL:", input);

  const response = await fetch(input, {
    ...init,
    headers: {
      ...init?.headers,
      "Content-Type": "application/json",
      Accept: "application/json",
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
