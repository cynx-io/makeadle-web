import { createClient } from "@connectrpc/connect";
import { PlatoTopicService } from "@/proto/janus/plato/topic_pb";
import { PlatoModeService } from "@/proto/janus/plato/mode_pb";
import { PlatoAnswerService } from "@/proto/janus/plato/answer_pb";
import { PlatoAnswerCategoryService } from "@/proto/janus/plato/answercategory_pb";
import { PlatoDailyGameService } from "@/proto/janus/plato/dailygame_pb";
import { serverTransport } from "@/lib/janus/server-client/serverTransport";

export const topicServerClient = createClient(
  PlatoTopicService,
  serverTransport,
);
export const modeServerClient = createClient(PlatoModeService, serverTransport);
export const answerServerClient = createClient(
  PlatoAnswerService,
  serverTransport,
);
export const answerCategoryServerClient = createClient(
  PlatoAnswerCategoryService,
  serverTransport,
);
export const dailyGameServerClient = createClient(
  PlatoDailyGameService,
  serverTransport,
);
