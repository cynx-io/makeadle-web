import { AdminTopicCard } from "@/components/admin/AdminTopicCard";
import { topicServerClient } from "@/lib/janus/server-client/plato";
import { newJanusServerError } from "@/lib/janus/server-client/error";

export default async function DashboardPage() {
  const topics = await topicServerClient.listTopicsByUserId({}).catch((err) => {
    newJanusServerError(err).handle();
  });
  if (!topics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">No Topic</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
      <div className={"flex gap-5"}>
        {topics.topics.map((topic) => {
          return (
            <AdminTopicCard
              topic={topic}
              redirect={"dashboard/" + topic.slug}
              key={topic.slug}
            />
          );
        })}
      </div>
    </div>
  );
}
