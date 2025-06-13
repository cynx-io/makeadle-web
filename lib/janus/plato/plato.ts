import { createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { PlatoTopicService } from "../../proto/janus/plato/topic_pb";

const transport = createConnectTransport({
  baseUrl: "http://devspace:31500",
});

export const topicClient = createClient(PlatoTopicService, transport);
