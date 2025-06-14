"use client";

export const callApi = (url: string, body: any): Promise<Response> => {
  const jsonBody = JSON.stringify(body);
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: jsonBody,
  });
};
