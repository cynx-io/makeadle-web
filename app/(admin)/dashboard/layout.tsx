import React from "react";
import { newJanusError } from "@/lib/janus/error";
import { topicServerClient } from "@/lib/janus/server-client/plato";
import { DashboardSidebar } from "@/components/admin/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export const metadata = {
  title: "Dashboard",
};

type Props = { children: React.ReactNode };

export default async function DashboardLayout({ children }: Props) {
  const resp = await topicServerClient.listTopicsByUserId({}).catch((err) => {
    newJanusError(err).handle();
  });

  if (resp == null) {
    return <div></div>;
  }

  const topics = resp.topics;

  return (
    <SidebarProvider defaultOpen={true}>
      <div className={"flex h-screen w-screen bg-white-gradient"}>
        <DashboardSidebar topics={topics} />
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  );
}
