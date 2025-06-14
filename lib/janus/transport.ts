import { BaseResponse } from "@/proto/janus/core/core_pb";
import {createConnectTransport} from "@connectrpc/connect-web";

export const transport = createConnectTransport({
    baseUrl: "http://152.53.169.236:31500",
    fetch: fetchJanus,
});


async function fetchJanus(
    input: RequestInfo | URL,
    init?: RequestInit
): Promise<Response> {
    console.log("Fetch URL:", input);
    console.log("Fetch init:", init);

    const response = await fetch(input, init);
    console.log("Response status:", response.status);

    if (!response.ok) {
        console.error("Fetch error:", response.statusText);
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.clone().json(); // clone so caller can still read body
    const baseResponse = responseData.base as BaseResponse;

    if (baseResponse?.code !== "00") {
        console.error("Error in response:", baseResponse.code);
        throw new Error(`Service error: ${baseResponse.code}`);
    }

    return response;
}
