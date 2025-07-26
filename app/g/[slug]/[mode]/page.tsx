import { GameSection } from "@/components/game/GameSection";
import MakeadleBar from "@/components/game/MakeadleBar";
import { GameProvider } from "@/context/GameContext";
import { newJanusServerError } from "@/lib/janus/server-client/error";
import {
  answerServerClient,
  dailyGameServerClient,
  modeServerClient,
  topicServerClient,
} from "@/lib/janus/server-client/plato";
import { notFound, redirect } from "next/navigation";
import Script from "next/script";
import ParticleScreen from "@/components/game/ParticleScreen";
import TitleImage from "@/components/game/modes/TitleImage";
import ModeSelector from "@/components/game/ModeSelector";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string; mode: string }>;
};

export default async function TopicModesPage({ params }: Props) {
  const { slug, mode } = await params;

  console.log(`[${slug}/${mode}] Starting API calls`);

  const topicResp = await topicServerClient
    .getTopicBySlug({ slug: slug })
    .then((resp) => {
      console.log(
        `[${slug}/${mode}] GetTopicBySlug success:`,
        resp?.topic ? "found" : "not found",
      );
      return resp;
    })
    .catch((err) => {
      console.log(`[${slug}/${mode}] GetTopicBySlug error:`, err);
      newJanusServerError(err).handle();
      return null;
    });

  const topic = topicResp?.topic;
  if (!topic) {
    console.log(`[${slug}/${mode}] Topic not found, returning 404`);
    return notFound();
  }

  const modesResp = await modeServerClient
    .listModesByTopicId({ topicId: topic.id })
    .then((resp) => {
      console.log(
        `[${slug}/${mode}] ListModesByTopicId success:`,
        resp?.modes?.length || 0,
        "modes",
      );
      return resp;
    })
    .catch((err) => {
      console.log(`[${slug}/${mode}] ListModesByTopicId error:`, err);
      newJanusServerError(err).handle();
      return null;
    });

  const modes = modesResp?.modes;
  if (!modes) {
    console.log(
      `[${slug}/${mode}] Modes API failed, redirecting to /g/${slug} to retry`,
    );
    redirect(`/g/${slug}`);
  }
  if (modes.length === 0) {
    console.log(`[${slug}/${mode}] No modes available for topic`);
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
    console.log(
      `[${slug}/${mode}] Mode '${mode}' not found in available modes:`,
      modes.map((m) => m.title),
    );
    console.log(`[${slug}/${mode}] Redirecting to default mode via /g/${slug}`);
    redirect(`/g/${slug}`);
  }

  console.log(`[${slug}/${mode}] Found current mode:`, currentMode.title);

  const answersRespPromise = answerServerClient
    .listAnswersByTopicId({
      topicId: topic.id,
    })
    .catch((err) => {
      newJanusServerError(err).handle();
      return null;
    });

  const dailyGameResp = await dailyGameServerClient
    .getPublicDailyGame({
      modeId: currentMode.id,
    })
    .catch((err) => {
      newJanusServerError(err).handle();
      return null;
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
      className="h-screen w-screen overflow-y-auto bg-cover bg-center bg-fixed text-white bg-animate-glow overflow-x-hidden"
      style={{ backgroundImage: `url(${backgroundUrl || "/img/invalid.png"})` }}
    >
      <ParticleScreen />
      <Script
        id={`jsonld-game-${topic.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MakeadleBar />

      <div className="flex flex-col items-center px-4 py-10 mb-[30vh]">
        <TitleImage src={topic.titleImageUrl} alt={topic.title}></TitleImage>
        <p className="text-xl font-bold shadow-2xl text-center max-w-2xl mb-5">
          {currentMode.description}
        </p>

        <GameProvider
          value={{
            topic,
            modes,
            currentMode: currentMode,
            dailyGame,
            answers: answers,
          }}
        >
          <div className="flex space-x-6 overflow-x-auto px-4 py-6 h-full">
            <ModeSelector modes={modes} />
          </div>
          <div className="w-full h-full">
            <GameSection />
          </div>
        </GameProvider>
      </div>
    </div>
  );
}
