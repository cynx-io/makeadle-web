import { GameSection } from "@/components/game/GameSection";
import { newJanusServerError } from "@/lib/janus/server-client/error";
import {
  modeServerClient,
  topicServerClient,
} from "@/lib/janus/server-client/plato";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string; mode: string }>;
};

export default async function TopicModesPage({ params }: Props) {
  const { slug, mode } = await params;

  return (
    <div className="w-full h-full">
      <GameSection />
    </div>
  );
}
