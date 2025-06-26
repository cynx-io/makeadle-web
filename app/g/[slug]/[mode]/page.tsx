import { GameSection } from "@/components/game/GameSection";
import MakeadleBar from "@/components/game/MakeadleBar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import Script from "next/script";

type Props = {
  params: Promise<{ slug: string; mode: string }>;
};

export default async function TopicModesPage({ params }: Props) {
  const { slug, mode } = await params;

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

  const currentMode = modes.find(
    (m) => m.title.toLowerCase() === mode.toLowerCase(),
  );
  if (!currentMode) {
    return notFound();
  }

  const answersRespPromise = answerServerClient
    .listAnswersByTopicId({
      topicId: topic.id,
    })
    .catch((err) => {
      newJanusServerError(err).handle();
    });

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

  const answersResp = await answersRespPromise;
  if (!answersResp) {
    return notFound();
  }
  const answers = answersResp.answers;

  const backgroundUrl = modes[0]?.backgroundUrl || "/img/invalid.png";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Game",
    name: `Makeadle - ${topic.title} (${currentMode.title})`,
    description: currentMode.description,
    url: `https://www.makeadle.com/g/${slug}/${currentMode.Type.toLowerCase()}`,
    image: currentMode.backgroundUrl || topic.titleImageUrl,
    publisher: {
      "@type": "Organization",
      name: "Makeadle",
      url: "https://www.makeadle.com",
    },
    gamePlatform: "Web",
    genre: [currentMode.Type, topic.title],
    playMode: "SinglePlayer",
  };

  return (
    <div
      className="h-screen w-screen overflow-y-auto bg-cover bg-center bg-fixed text-white bg-animate-glow"
      style={{ backgroundImage: `url(${backgroundUrl || "/img/invalid.png"})` }}
    >
      <Script
        id={`jsonld-game-${topic.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MakeadleBar />

      <div className="flex flex-col items-center px-4 py-10 mb-[30vh]">
        <Image
          src={topic.titleImageUrl || "/img/invalid.png"}
          alt={topic.title}
          width={600}
          height={200}
          className="mt-[5vh]"
        />
        <p className="text-xl font-bold shadow-2xl text-center max-w-2xl mb-5">
          {currentMode.description}
        </p>

        <div className="flex space-x-6 overflow-x-auto px-4 py-6">
          {modes.map((mode) => (
            <Link
              key={mode.id}
              href={`/g/${slug}/${mode.title.toLowerCase()}`}
              className=""
            >
              <div className="size-16 rounded-full overflow-hidden mb-3 border-2 border-white/50 hover:brightness-75">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Image
                      src={mode.iconUrl || "/img/default-icon.png"}
                      alt={mode.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      height={100}
                      width={100}
                    />
                  </TooltipTrigger>

                  <TooltipContent>
                    <p>{mode.title}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </Link>
          ))}
        </div>
        <GameProvider
          value={{
            topic,
            modes,
            currentMode: currentMode,
            dailyGame,
            answers: answers,
          }}
        >
          <div className="w-full h-full">
            <GameSection />
          </div>
        </GameProvider>
      </div>
    </div>
  );
}
