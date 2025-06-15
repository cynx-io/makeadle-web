import { createClient } from "@connectrpc/connect";
import { HermesUserService } from "@/proto/janus/hermes/user_pb";
import { serverTransport } from "@/lib/janus/server-client/serverTransport";

export const userServerClient = createClient(
  HermesUserService,
  serverTransport,
);
