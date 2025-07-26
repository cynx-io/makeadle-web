"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  topicClient,
  modeClient,
  answerClient,
} from "@/lib/janus/client/plato";
import { newJanusError } from "@/lib/janus/client/error";
import { Badge } from "@/components/ui/badge";
import { Gamepad2, Database, Target, Calendar } from "lucide-react";

interface DashboardStats {
  totalTopics: number;
  totalModes: number;
  totalAnswers: number;
  recentTopics: Array<{ title: string; slug: string; modesCount: number }>;
}

export function OverviewDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const topicsResp = await topicClient.listTopicsByUserId({});
        const topics = topicsResp?.topics || [];

        let totalModes = 0;
        let totalAnswers = 0;
        const recentTopics = [];

        for (const topic of topics.slice(0, 5)) {
          const modesResp = await modeClient.listModesByTopicId({
            topicId: topic.id,
          });
          const modes = modesResp?.modes || [];
          totalModes += modes.length;

          const answersResp = await answerClient.listAnswersByTopicId({
            topicId: topic.id,
          });
          const answers = answersResp?.answers || [];
          totalAnswers += answers.length;

          recentTopics.push({
            title: topic.title,
            slug: topic.slug,
            modesCount: modes.length,
          });
        }

        setStats({
          totalTopics: topics.length,
          totalModes,
          totalAnswers,
          recentTopics,
        });
      } catch (err) {
        newJanusError(err).handle();
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (!stats) {
    return <div>Failed to load dashboard stats.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Topics</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTopics}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Modes</CardTitle>
            <Gamepad2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalModes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Answers</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAnswers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Modes/Topic
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalTopics > 0
                ? Math.round((stats.totalModes / stats.totalTopics) * 10) / 10
                : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Topics</CardTitle>
          <CardDescription>Your latest topics and their modes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentTopics.map((topic) => (
              <div
                key={topic.slug}
                className="flex items-center justify-between"
              >
                <div>
                  <h3 className="font-medium">{topic.title}</h3>
                  <p className="text-sm text-muted-foreground">/{topic.slug}</p>
                </div>
                <Badge variant="secondary">{topic.modesCount} modes</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
