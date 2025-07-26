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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { topicClient, answerClient } from "@/lib/janus/client/plato";
import { newJanusError } from "@/lib/janus/client/error";
import { DashboardAnswerTable } from "@/components/admin/answer/table/DashboardAnswerTable";

interface Topic {
  id: string;
  title: string;
  slug: string;
}

export function DetailedAnswerManagement() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [detailAnswers, setDetailAnswers] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      setLoading(true);
      const topicsResp = await topicClient.listTopicsByUserId({});
      const topicList = topicsResp?.topics || [];
      setTopics(topicList);

      if (topicList.length > 0) {
        setSelectedTopic(topicList[0]);
        loadDetailAnswers(topicList[0].id);
      }
    } catch (err) {
      newJanusError(err).handle();
    } finally {
      setLoading(false);
    }
  };

  const loadDetailAnswers = async (topicId: string) => {
    try {
      const detailAnswersResp =
        await answerClient.listDetailAnswersByTopicModeId({ topicId });

      if (detailAnswersResp) {
        setDetailAnswers(detailAnswersResp.detailAnswers || []);
      }
    } catch (err) {
      newJanusError(err).handle();
    }
  };

  const handleTopicChange = (topicId: string) => {
    const topic = topics.find((t) => t.id === topicId);
    if (topic) {
      setSelectedTopic(topic);
      loadDetailAnswers(topic.id);
    }
  };

  if (loading) {
    return <div>Loading topics...</div>;
  }

  if (topics.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No topics found. Create a topic first to manage detailed answers.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Detailed Answer Management</h2>
          <p className="text-muted-foreground">
            Manage answers and their categories with inline editing
          </p>
        </div>
        <Select
          value={selectedTopic?.id || ""}
          onValueChange={handleTopicChange}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a topic" />
          </SelectTrigger>
          <SelectContent>
            {topics.map((topic) => (
              <SelectItem key={topic.id} value={topic.id}>
                {topic.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedTopic && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedTopic.title}</CardTitle>
            <CardDescription>
              Detailed answer management with inline category editing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardAnswerTable
              detailAnswers={detailAnswers}
              topicId={selectedTopic.id}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
