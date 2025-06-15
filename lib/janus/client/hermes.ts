import { createClient } from "@connectrpc/connect";
import { HermesUserService } from "@/proto/janus/hermes/user_pb";
import { transport } from "@/lib/janus/client/transport";

export const userClient = createClient(HermesUserService, transport);
