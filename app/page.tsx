import { Topic } from "@/proto/janus/plato/object_pb";
import { Card } from "@/components/ui/card";
import { topicServerClient } from "@/lib/janus/server-client/plato";
import Link from "next/link";
import Image from "next/image";
import { newJanusServerError } from "@/lib/janus/server-client/error";

export default async function Home() {
  const res = await topicServerClient.paginateTopic({}).catch((err) => {
    console.error("Error fetching topics:", err);
    newJanusServerError(err).handle();
  });

  if (!res) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-animated-gradient p-8 sm:p-20">
      <div className="grid place-items-center gap-8 relative z-10">
        <h1 className="text-4xl font-bold text-center">Make your own DLE</h1>
        <div className={"flex w-full"}>
          {res.topics.map((topic: Topic) => (
            <Link
              href={"g/" + topic.slug}
              key={topic.id}
              className={"w-full max-w-md"}
            >
              <Card className="p-4 border rounded-lg shadow-md w-full">
                <Image
                  src={topic.iconUrl}
                  alt={topic.title}
                  width={100}
                  height={100}
                />
                <h2 className="text-2xl font-semibold">{topic.title}</h2>
                <p className="text-gray-600">{topic.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
