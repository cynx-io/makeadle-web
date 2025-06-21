import { GameProvider } from "@/context/GameContext";
import { newJanusServerError } from "@/lib/janus/server-client/error";
import {
  answerServerClient,
  dailyGameServerClient,
  modeServerClient,
  topicServerClient,
} from "@/lib/janus/server-client/plato";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

export default async function TopicLayout({ children, params }: Props) {
  const { slug } = await params;

  const topicResp = await topicServerClient
    .getTopicBySlug({ slug: slug })
    .catch((err) => newJanusServerError(err).handle());

  const topic = topicResp?.topic;
  if (!topic) return notFound();

  const modesResp = await modeServerClient
    .listModesByTopicId({ topicId: topic.id })
    .catch((err) => {
      newJanusServerError(err).handle();
    });
  const modes = modesResp?.modes;
  if (!modes) return notFound();

  if (modes.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg">No modes available for this topic.</p>
      </div>
    );
  }

  const currentMode = modes[0];

  const dailyGameResp = await dailyGameServerClient
    .getPublicDailyGame({
      modeId: currentMode.id,
    })
    .catch((err) => {
      newJanusServerError(err).handle();
    });
  if (!dailyGameResp) {
    return notFound();
  }
  const dailyGame = dailyGameResp.publicDailyGame;
  if (!dailyGame) {
    return notFound();
  }

  const answersResp = await answerServerClient
    .listDetailAnswersByTopicId({
      topicId: topic.id,
    })
    .catch((err) => {
      newJanusServerError(err).handle();
    });
  if (!answersResp) {
    return notFound();
  }
  const answers = answersResp.detailAnswers;

  const backgroundUrl = modes[0]?.backgroundUrl || "/img/invalid.png";

  return (
    <div
      className="h-screen w-screen overflow-y-auto bg-cover bg-center bg-fixed text-white"
      style={{ backgroundImage: `url(${backgroundUrl || "/img/invalid.png"})` }}
    >
      <div className="flex flex-col items-center px-4 py-10">
        <Image
          src={topic.titleImageUrl || "/img/invalid.png"}
          alt={topic.title}
          width={600}
          height={200}
          className="mb-1 mt-[10vh]"
        />
        <p className="text-lg text-center max-w-2xl mb-10">
          {currentMode.description}
        </p>

        <div className="flex space-x-6 overflow-x-auto px-4 py-6">
          {modes.map((mode) => (
            <Link
              key={mode.id}
              href={`/g/${slug}/${mode.Type.toLowerCase()}`}
              className=""
            >
              <div className="w-12 h-12 rounded-full overflow-hidden mb-3 border-2 border-white/50">
                <Image
                  src={mode.iconUrl || "/img/default-icon.png"}
                  alt={mode.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  height={100}
                  width={100}
                />
              </div>
            </Link>
          ))}
        </div>
        <GameProvider
          value={{
            topic,
            modes,
            currentMode: modes[0],
            dailyGame,
            answers: answers,
          }}
        >
          {children}
        </GameProvider>
      </div>
    </div>
  );
}
