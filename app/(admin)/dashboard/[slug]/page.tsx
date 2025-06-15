import { notFound } from "next/navigation";
import { newJanusError } from "@/lib/janus/error";
import {
  answerServerClient,
  topicServerClient,
} from "@/lib/janus/server-client/plato";
import { DashboardAnswerTable } from "@/components/admin/answer/table/DashboardAnswerTable";
import { cookies } from "next/headers";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function TopicPage({ params }: Props) {
  const { slug } = await params;

  const topicResp = await topicServerClient
    .getTopicBySlug({ slug })
    .catch((err) => {
      newJanusError(err).handle();
    });
  const topic = topicResp?.topic;
  if (!topic) return notFound();

  const detailAnswersResp = await answerServerClient
    .listDetailAnswersByTopicId({ topicId: topic.id })
    .catch((err) => {
      newJanusError(err).handle();
    });
  if (!detailAnswersResp) return notFound();
  const detailAnswers = detailAnswersResp.detailAnswers;

  if (!detailAnswers)
    return (
      <div>
        <p className="text-lg">No answer details found for this topic.</p>
      </div>
    );

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">{topic.title}</h1>
      <p className="text-gray-600">{topic.description}</p>

      <DashboardAnswerTable detailAnswers={detailAnswers} />
    </div>
  );
}
