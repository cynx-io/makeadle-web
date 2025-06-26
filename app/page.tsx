import { Topic } from "@/proto/janus/plato/object_pb";
import { topicServerClient } from "@/lib/janus/server-client/plato";
import { newJanusServerError } from "@/lib/janus/server-client/error";
import { notFound } from "next/navigation";
import MakeadleBar from "@/components/game/MakeadleBar";
import { LandingGallery } from "@/components/landing/LandingGallery";
import { LandingHero } from "@/components/landing/LandingHero";

export default async function Home() {
  const topicResp = await topicServerClient.paginateTopic({}).catch((err) => {
    console.error("Error fetching topics:", err);
    newJanusServerError(err).handle();
  });

  if (!topicResp) {
    return notFound();
  }

  const topics = topicResp.topics;
  if (!topics || topics.length === 0) {
    return notFound();
  }

  return (
    <div className="h-screen overflow-y-auto flex flex-col font-inter">
      <div className="absolute top-0 left-0 z-50 w-screen">
        <MakeadleBar />
      </div>

      <div className="w-full px-20">
        <LandingHero
          image={{ src: "icon.png", alt: "makeadle" }}
          heading="Make your DLE"
          badge="✨ Explore"
          description="Make your own DLE at Makeadle or play other user created DLEs !"
          buttons={{
            primary: { text: "Create Yours", url: "/dashboard" },
            secondary: { text: "Explore DLEs", url: "/g/mobiledle" },
          }}
        />
        <LandingGallery
          items={topics.map((topic: Topic) => ({
            title: topic.title,
            description: topic.description,
            image: topic.bannerUrl ?? "/img/invalid.png",
            link: `/g/${topic.slug}`,
            id: topic.id.toString(),
            summary: topic.description,
            slug: topic.slug,
            url: `/g/${topic.slug}`,
          }))}
        />
      </div>

      <footer className="w-full py-8 text-center text-gray-500 text-sm bg-gray-900">
        <p>&copy; {new Date().getFullYear()} Makeadle. All rights reserved.</p>
      </footer>
    </div>
  );
}
