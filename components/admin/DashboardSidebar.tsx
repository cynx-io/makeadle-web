"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Topic } from "@/proto/janus/plato/object_pb";
import { Book, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  topics: Topic[];
};

export function DashboardSidebar({ topics }: Props) {
  const { toggleSidebar } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();

  // Extract current slug from URL path
  const currentSlug = pathname.split("/").pop() || "";

  // Find current topic for placeholder
  const currentTopic = topics.find((t) => t.slug === currentSlug);

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarContent className="flex flex-col h-full p-0">
        {/* Toggle button at top - always left-aligned */}
        <div className="flex items-center justify-start h-12 border-b border-gray-200">
          <Button
            variant="ghost"
            onClick={toggleSidebar}
            className="h-12 w-12 flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5 rotate-180 group-data-[collapsible=icon]:hidden" />
            <ChevronRight className="w-5 h-5 hidden group-data-[collapsible=icon]:block" />
          </Button>
        </div>

        {/* Topic Selector - hidden in mini mode */}
        <div className="p-4 border-b group-data-[collapsible=icon]:hidden">
          <Select
            value={currentSlug}
            onValueChange={(slug) => router.push(`/dashboard/${slug}`)}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={currentTopic?.title || "Choose a topic…"}
              />
            </SelectTrigger>
            <SelectContent>
              {topics.map((t) => (
                <SelectItem key={t.id.toString()} value={t.slug}>
                  {t.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sidebar Menu - hidden in mini mode */}
        <div className="group-data-[collapsible=icon]:hidden">
          <SidebarGroup className="flex-1 overflow-y-auto">
            <SidebarGroupLabel className="my-2 ml-2 text-sm uppercase">
              All Topics
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="flex flex-col">
                {topics.map((t) => (
                  <SidebarMenuItem key={t.id.toString()} className="mb-1">
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "justify-start",
                        t.slug === currentSlug && "bg-gray-100",
                      )}
                    >
                      <Link
                        href={`/dashboard/${t.slug}`}
                        className="relative flex items-center"
                      >
                        <Book className="h-5 w-5" />
                        <span className="ml-3">{t.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
