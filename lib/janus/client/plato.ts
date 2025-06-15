import { createClient } from "@connectrpc/connect";
import { PlatoTopicService } from "@/proto/janus/plato/topic_pb";
import { PlatoModeService } from "@/proto/janus/plato/mode_pb";
import { PlatoAnswerService } from "@/proto/janus/plato/answer_pb";
import { PlatoAnswerCategoryService } from "@/proto/janus/plato/answercategory_pb";
import { PlatoDailyGameService } from "@/proto/janus/plato/dailygame_pb";
import { transport } from "@/lib/janus/client/transport";

export const topicClient = createClient(PlatoTopicService, transport);
export const modeClient = createClient(PlatoModeService, transport);
export const answerClient = createClient(PlatoAnswerService, transport);
export const answerCategoryClient = createClient(
  PlatoAnswerCategoryService,
  transport,
);
export const dailyGameClient = createClient(PlatoDailyGameService, transport);
