"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TopicManagement } from "@/components/admin/TopicManagement";
import { ModeManagement } from "@/components/admin/ModeManagement";
import { AnswerManagement } from "@/components/admin/AnswerManagement";
import { DailyGameManagement } from "@/components/admin/DailyGameManagement";
import { OverviewDashboard } from "@/components/admin/OverviewDashboard";
import { DetailedAnswerManagement } from "@/components/admin/DetailedAnswerManagement";

interface AdminDashboardProps {
  defaultTab: string;
}

export function AdminDashboard({ defaultTab }: AdminDashboardProps) {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      <Tabs defaultValue={defaultTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="modes">Modes</TabsTrigger>
          <TabsTrigger value="answers">Answers</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Answers</TabsTrigger>
          <TabsTrigger value="games">Daily Games</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <OverviewDashboard />
        </TabsContent>

        <TabsContent value="topics" className="space-y-4">
          <TopicManagement />
        </TabsContent>

        <TabsContent value="modes" className="space-y-4">
          <ModeManagement />
        </TabsContent>

        <TabsContent value="answers" className="space-y-4">
          <AnswerManagement />
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          <DetailedAnswerManagement />
        </TabsContent>

        <TabsContent value="games" className="space-y-4">
          <DailyGameManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
