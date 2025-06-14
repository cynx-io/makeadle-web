import { z } from "zod";

export const BaseResp = z.object({
  code: z.string(),
  desc: z.string(),
});
