import { GameSection } from "@/components/game/GameSection";

type Props = {
  params: Promise<{ slug: string; mode: string }>;
};

export default async function TopicModesPage({ params }: Props) {
  // const { slug, mode } = await params;

  return (
    <div className="w-full h-full">
      <GameSection />
    </div>
  );
}
