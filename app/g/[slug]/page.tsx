import { notFound, redirect } from "next/navigation";
import {
  modeServerClient,
  topicServerClient,
} from "@/lib/janus/server-client/plato";
import { newJanusServerError } from "@/lib/janus/server-client/error";
type Props = {
  params: Promise<{ slug: string }>;
};

export default async function TopicModesPage({ params }: Props) {
  const { slug } = await params;

  const topicResp = await topicServerClient
    .getTopicBySlug({ slug: slug })
    .catch((err) => newJanusServerError(err).handle());
  const topic = topicResp?.topic;
  if (!topic) {
    return notFound();
  }

  console.log("Topic found:", topic);

  const modesResp = await modeServerClient
    .listModesByTopicId({ topicId: topic.id })
    .catch((err) => newJanusServerError(err).handle());

  const modes = modesResp?.modes;
  if (!modes || modes.length === 0) {
    return notFound();
  }

  // router.replace(`/g/${topic.slug}/${modes[0].title.toLowerCase()}`);
  redirect(`/g/${topic.slug}/${modes[0].title.toLowerCase()}`);
  return <div className={"fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center z-50"}></div>;
}
