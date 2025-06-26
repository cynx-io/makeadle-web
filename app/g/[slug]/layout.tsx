import { newJanusServerError } from "@/lib/janus/server-client/error";
import {
  modeServerClient,
  topicServerClient,
} from "@/lib/janus/server-client/plato";
import type { ReactNode } from "react";

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
      openGraph: {
        title: "Makeadle",
        description: "Create and share your own wordle games!",
        url: "https://www.makeadle.com",
        images: ["/img/invalid.png"],
        type: "website",
        siteName: "Makeadle",
      },
      twitter: {
        card: "summary_large_image",
        title: "Makeadle",
        description: "Create and share your own wordle games!",
        images: ["/img/invalid.png"],
      },
    };

  const modesResp = await modeServerClient
    .listModesByTopicId({ topicId: topic.id })
    .catch((err) => {
      newJanusServerError(err).handle();
    });
  const modes = modesResp?.modes;
  if (!modes || modes.length === 0)
    return {
      title: "Makeadle",
      description: `Create and share wordle games for ${topic.title}!`,
      openGraph: {
        title: "Makeadle",
        description: "Create and share your own wordle games!",
        url: "https://www.makeadle.com",
        images: ["/img/invalid.png"],
        type: "website",
        siteName: "Makeadle",
      },
      twitter: {
        card: "summary_large_image",
        title: "Makeadle",
        description: "Create and share your own wordle games!",
        images: ["/img/invalid.png"],
      },
    };

  const currentMode = modes[0];

  return {
    title: `${topic.title} (${currentMode.title})`, // e.g., Makeadle - Mobiledle (Classic)
    description: currentMode.description, // Use the mode description
    openGraph: {
      title: `Makeadle - ${topic.title} (${currentMode.title})`,
      description: `${currentMode.description}.`,
      url: `https://www.makeadle.com/g/${slug}/${currentMode.title.toLowerCase()}`, // Replace with your actual domain
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
      siteName: "Makeadle",
      locale: "en_US", // Adjust based on your audience
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
  return <div>{children}</div>;
}
