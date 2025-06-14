import { z } from "zod";
import { BaseResp } from "@/lib/janus/response";
import { getJanusBaseUrl } from "@/lib/utils";

export const EthSearchReqSchema = z.object({
  query: z.string(),
});

export const EthSearchRespSchema = z.object({
  base: BaseResp,
  coins: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      symbol: z.string(),
      thumb: z.string(),
      large: z.string(),
    }),
  ),
});

export type EthSearchResp = z.infer<typeof EthSearchRespSchema>;

export const ethSearch = async (query: string): Promise<EthSearchResp> => {
  const parsed = EthSearchReqSchema.safeParse({ query });
  if (!parsed.success) throw new Error("Invalid query");

  const res = await fetch(`${getJanusBaseUrl()}/api/v1/crypto/eth/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Search failed: ${errorText}`);
  }

  const data = await res.json();

  const validated = EthSearchRespSchema.safeParse(data);
  if (!validated.success) {
    console.error(validated.error.format());
    throw new Error("Invalid response structure");
  }

  return validated.data;
};
