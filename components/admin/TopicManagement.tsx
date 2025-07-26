"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { topicClient, modeClient } from "@/lib/janus/client/plato";
import { newJanusError } from "@/lib/janus/client/error";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";

interface TopicWithModes {
  id: string;
  title: string;
  description: string;
  slug: string;
  iconUrl?: string;
  bannerUrl?: string;
  titleImageUrl?: string;
  modesCount: number;
}

interface TopicFormData {
  title: string;
  description: string;
  slug: string;
  iconUrl: string;
  bannerUrl: string;
  titleImageUrl: string;
}

export function TopicManagement() {
  const [topics, setTopics] = useState<TopicWithModes[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTopic, setEditingTopic] = useState<TopicWithModes | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<TopicFormData>({
    title: "",
    description: "",
    slug: "",
    iconUrl: "",
    bannerUrl: "",
    titleImageUrl: "",
  });

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      setLoading(true);
      const topicsResp = await topicClient.listTopicsByUserId({});
      const topicList = topicsResp?.topics || [];

      const topicsWithModes = await Promise.all(
        topicList.map(async (topic) => {
          const modesResp = await modeClient.listModesByTopicId({
            topicId: topic.id,
          });
          return {
            ...topic,
            modesCount: modesResp?.modes?.length || 0,
          };
        }),
      );

      setTopics(topicsWithModes);
    } catch (err) {
      newJanusError(err).handle();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTopic) {
        await topicClient.updateTopic({
          id: editingTopic.id,
          title: formData.title,
          description: formData.description,
          slug: formData.slug,
          iconUrl: formData.iconUrl || undefined,
          bannerUrl: formData.bannerUrl || undefined,
          titleImageUrl: formData.titleImageUrl || undefined,
        });
      } else {
        await topicClient.insertTopic({
          title: formData.title,
          description: formData.description,
          slug: formData.slug,
          iconUrl: formData.iconUrl || undefined,
          bannerUrl: formData.bannerUrl || undefined,
          titleImageUrl: formData.titleImageUrl || undefined,
        });
      }

      resetForm();
      setIsDialogOpen(false);
      loadTopics();
    } catch (err) {
      newJanusError(err).handle();
    }
  };

  const handleEdit = (topic: TopicWithModes) => {
    setEditingTopic(topic);
    setFormData({
      title: topic.title,
      description: topic.description,
      slug: topic.slug,
      iconUrl: topic.iconUrl || "",
      bannerUrl: topic.bannerUrl || "",
      titleImageUrl: topic.titleImageUrl || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (topicId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this topic? This will also delete all associated modes and answers.",
      )
    ) {
      return;
    }

    try {
      await topicClient.deleteTopic({ id: topicId });
      loadTopics();
    } catch (err) {
      newJanusError(err).handle();
    }
  };

  const resetForm = () => {
    setEditingTopic(null);
    setFormData({
      title: "",
      description: "",
      slug: "",
      iconUrl: "",
      bannerUrl: "",
      titleImageUrl: "",
    });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData({ ...formData, title });
    if (!editingTopic && !formData.slug) {
      setFormData({ ...formData, title, slug: generateSlug(title) });
    }
  };

  if (loading) {
    return <div>Loading topics...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Topic Management</h2>
          <p className="text-muted-foreground">
            Create and manage your game topics
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              New Topic
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingTopic ? "Edit Topic" : "Create New Topic"}
              </DialogTitle>
              <DialogDescription>
                {editingTopic
                  ? "Update the topic details below."
                  : "Fill in the details to create a new topic."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="slug" className="text-right">
                    Slug
                  </Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="iconUrl" className="text-right">
                    Icon URL
                  </Label>
                  <Input
                    id="iconUrl"
                    value={formData.iconUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, iconUrl: e.target.value })
                    }
                    className="col-span-3"
                    placeholder="https://..."
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="bannerUrl" className="text-right">
                    Banner URL
                  </Label>
                  <Input
                    id="bannerUrl"
                    value={formData.bannerUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, bannerUrl: e.target.value })
                    }
                    className="col-span-3"
                    placeholder="https://..."
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="titleImageUrl" className="text-right">
                    Title Image URL
                  </Label>
                  <Input
                    id="titleImageUrl"
                    value={formData.titleImageUrl}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        titleImageUrl: e.target.value,
                      })
                    }
                    className="col-span-3"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingTopic ? "Update Topic" : "Create Topic"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Topics ({topics.length})</CardTitle>
          <CardDescription>All your game topics</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Modes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topics.map((topic) => (
                <TableRow key={topic.id}>
                  <TableCell className="font-medium">{topic.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{topic.slug}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {topic.description}
                  </TableCell>
                  <TableCell>
                    <Badge>{topic.modesCount} modes</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(topic)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(topic.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Link href={`/g/${topic.slug}`} target="_blank">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
