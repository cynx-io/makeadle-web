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
import type { ReactNode } from "react";
import Script from "next/script";

type Props = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const topicResp = await topicServerClient
    .getTopicBySlug({ slug: slug })
    .catch((err) => newJanusServerError(err).handle());

  const topic = topicResp?.topic;
  if (!topic)
    return {
      title: "Makeadle",
      description: "Create and share your own wordle games!",
    }; // Basic fallback

  const modesResp = await modeServerClient
    .listModesByTopicId({ topicId: topic.id })
    .catch((err) => {
      newJanusServerError(err).handle();
    });
  const modes = modesResp?.modes;
  if (!modes)
    return {
      title: "Makeadle",
      description: `Create and share wordle games for ${topic.title}!`,
    }; // Fallback with topic

  const currentMode = modes[0];

  return {
    title: `${topic.title} (${currentMode.title})`, // e.g., Makeadle - Mobiledle (Classic)
    description: currentMode.description, // Use the mode description
    openGraph: {
      title: `Makeadle - ${topic.title} (${currentMode.title})`,
      description: currentMode.description,
      url: `https://www.makeadle.com/g/${slug}/${currentMode.Type.toLowerCase()}`, // Replace with your actual domain
      images: [
        {
          url:
            currentMode.backgroundUrl ||
            topic.titleImageUrl ||
            "/img/invalid.png", // Fallback image
          width: 1200, // Recommended dimensions
          height: 630,
          alt: `Makeadle ${topic.title} ${currentMode.title} Screenshot`,
        },
      ],
      type: "website", // or 'article' if it's a blog post
    },
    twitter: {
      card: "summary_large_image", // For larger images
      title: `Makeadle - ${topic.title} (${currentMode.title})`,
      description: currentMode.description,
      images: [
        currentMode.backgroundUrl || topic.titleImageUrl || "/img/invalid.png",
      ],
    },
  };
}

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
              href={`/g/${slug}/${mode.Type.toLowerCase()}`}
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
