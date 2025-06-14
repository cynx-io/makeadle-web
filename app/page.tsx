import { topicClient } from "@/lib/janus/plato";
import { Topic } from "@/proto/janus/plato/object_pb";
import { Card } from "@/components/ui/card";

export default async function Home() {
  const res = await topicClient.paginateTopic({}).catch((err) => {
    console.error("Error fetching topics:", err);
  });

  if (!res) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen p-8 sm:p-20">
      <div className="grid place-items-center gap-8 relative z-10">
        <h1 className="text-4xl font-bold text-center">
          Welcome to the Makeadle Platform
        </h1>
        {res.topics.map((topic: Topic) => (
          <Card
            key={topic.id}
            className="p-4 border rounded-lg shadow-md w-full max-w-md"
          >
            <h2 className="text-2xl font-semibold">{topic.title}</h2>
            <p className="text-gray-600">{topic.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
