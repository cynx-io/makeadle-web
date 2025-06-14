import { z } from "zod";
import { BaseResp } from "@/lib/janus/response";
import { getJanusBaseUrl } from "@/lib/utils";

export const EthGetRiskReqSchema = z.object({
  coin_id: z.string(),
});

export const EthRiskFlag = z.object({
  value: z.boolean(),
  severity: z.number(),
  reason: z.string(),
});

export const EthGetRiskRespSchema = z.object({
  base: BaseResp,
  token_info: z.object({
    name: z.string(),
    symbol: z.string(),
    contract_address: z.string(),
    logo_url: z.string(),
    chain: z.string(),
    total_supply: z.number(),
    decimals: z.number(),
  }),
  risk_flags: z.object({
    functions: z.object({
      mint: EthRiskFlag,
      owner: EthRiskFlag,
      pause: EthRiskFlag,
      unpause: EthRiskFlag,
      set_fee_percent: EthRiskFlag,
      transfer_ownership: EthRiskFlag,
      renounce_ownership: EthRiskFlag,
      disable_transfer: EthRiskFlag,
      blacklist: EthRiskFlag,
      whitelist: EthRiskFlag,
    }),
    ownership_renounced: EthRiskFlag,
    verified_contract: EthRiskFlag,
    is_honeypot: EthRiskFlag,
    liquidity_locked: EthRiskFlag,
    recent_deployment: EthRiskFlag,
    is_proxy: EthRiskFlag,
    is_open_source: EthRiskFlag,
    is_anti_whale: EthRiskFlag,
    is_gas_abuser: EthRiskFlag,
    notes: z.string(),
  }),
  holder_info: z.object({
    top_ten_holder_percentage: z.number(),
    holders: z.array(
      z.object({
        address: z.string(),
        percentage: z.number(),
        balance: z.number(),
        is_locked: z.boolean(),
      }),
    ),
    top_ten_lp_holder_percentage: z.number(),
    lp_holders: z.array(
      z.object({
        address: z.string(),
        percentage: z.number(),
        balance: z.number(),
        is_locked: z.boolean(),
      }),
    ),
    lp_locked_percentage: z.number(),
    lp_locked_balance: z.number(),
    lp_total_balance: z.number(),
  }),
  social_info: z.object({
    website: z.string(),
    github: z.string(),
    twitter: z.string(),
    reddit: z.string(),
    description: z.string(),
  }),
  market_info: z.object({
    market_cap: z.number(),
    volume_24h: z.number(),
    price: z.number(),
    price_change_24h: z.number(),
    price_change_percentage_24h: z.number(),
    circulating_supply: z.number(),
    total_supply: z.number(),
    max_supply: z.number(),
  }),
  risk_score: z.object({ score: z.number(), description: z.string() }),
});

export type EthGetRiskReq = z.infer<typeof EthGetRiskReqSchema>;
export type EthGetRiskResp = z.infer<typeof EthGetRiskRespSchema>;

export const ethGetRisk = async (
  req: EthGetRiskReq,
): Promise<EthGetRiskResp> => {
  const parsed = EthGetRiskReqSchema.safeParse(req);
  if (!parsed.success) throw new Error("Invalid request");

  const res = await fetch(`${getJanusBaseUrl()}/api/v1/crypto/eth/risk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parsed.data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`GetRisk failed: ${errorText}`);
  }

  const data = await res.json();

  const validated = EthGetRiskRespSchema.safeParse(data);
  if (!validated.success) {
    console.error(validated.error.format());
    throw new Error("Invalid response structure");
  }

  return validated.data;
};
