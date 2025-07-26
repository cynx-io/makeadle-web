import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function TopicPage({ params: _params }: Props) {
  // Redirect to main dashboard with topics tab
  redirect("/dashboard?tab=topics");
}
