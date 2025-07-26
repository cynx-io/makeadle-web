import { notFound, redirect } from "next/navigation";
import {
  modeServerClient,
  topicServerClient,
} from "@/lib/janus/server-client/plato";
import { newJanusServerError } from "@/lib/janus/server-client/error";

export const dynamic = "force-dynamic";
type Props = {
  params: Promise<{ slug: string }>;
};

export default async function TopicModesPage({ params }: Props) {
  const { slug } = await params;

  console.log(`[${slug}] Starting redirect page API calls`);

  const topicResp = await topicServerClient
    .getTopicBySlug({ slug: slug })
    .then((resp) => {
      console.log(
        `[${slug}] GetTopicBySlug success:`,
        resp?.topic ? "found" : "not found",
      );
      return resp;
    })
    .catch((err) => {
      console.log(`[${slug}] GetTopicBySlug error:`, err);
      newJanusServerError(err).handle();
      return null;
    });
  const topic = topicResp?.topic;
  if (!topic) {
    console.log(`[${slug}] Topic not found, returning 404`);
    return notFound();
  }

  console.log(`[${slug}] Topic found:`, topic.title);

  const modesResp = await modeServerClient
    .listModesByTopicId({ topicId: topic.id })
    .then((resp) => {
      console.log(
        `[${slug}] ListModesByTopicId success:`,
        resp?.modes?.length || 0,
        "modes",
      );
      return resp;
    })
    .catch((err) => {
      console.log(`[${slug}] ListModesByTopicId error:`, err);
      newJanusServerError(err).handle();
      return null;
    });

  const modes = modesResp?.modes;
  if (!modes || modes.length === 0) {
    console.log(`[${slug}] No modes found, returning 404`);
    return notFound();
  }

  const redirectUrl = `/g/${topic.slug}/${modes[0].title.toLowerCase()}`;
  console.log(`[${slug}] Redirecting to:`, redirectUrl);
  redirect(redirectUrl);
  return (
    <div
      className={
        "fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center z-50"
      }
    ></div>
  );
}
