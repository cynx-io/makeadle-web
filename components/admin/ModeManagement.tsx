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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface Topic {
  id: string;
  title: string;
  slug: string;
}

interface ModeWithTopic {
  id: string;
  title: string;
  description: string;
  type: string;
  iconUrl?: string;
  backgroundUrl?: string;
  topicId: string;
  topicTitle: string;
  topicSlug: string;
}

interface ModeFormData {
  title: string;
  description: string;
  type: string;
  iconUrl: string;
  backgroundUrl: string;
  topicId: string;
}

const GAME_TYPES = [
  { label: "Wordle", value: "Wordle" },
  { label: "Audiodle", value: "Audiodle" },
  { label: "Blurdle", value: "Blurdle" },
];

export function ModeManagement() {
  const [modes, setModes] = useState<ModeWithTopic[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMode, setEditingMode] = useState<ModeWithTopic | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<ModeFormData>({
    title: "",
    description: "",
    type: "",
    iconUrl: "",
    backgroundUrl: "",
    topicId: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load topics first
      const topicsResp = await topicClient.listTopicsByUserId({});
      const topicList = topicsResp?.topics || [];
      setTopics(topicList);

      // Load modes for all topics
      const allModes: ModeWithTopic[] = [];
      for (const topic of topicList) {
        const modesResp = await modeClient.listModesByTopicId({
          topicId: topic.id,
        });
        const topicModes = modesResp?.modes || [];

        topicModes.forEach((mode) => {
          allModes.push({
            ...mode,
            topicTitle: topic.title,
            topicSlug: topic.slug,
          });
        });
      }

      setModes(allModes);
    } catch (err) {
      newJanusError(err).handle();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMode) {
        await modeClient.updateMode({
          id: editingMode.id,
          title: formData.title,
          description: formData.description,
          type: formData.type,
          iconUrl: formData.iconUrl || undefined,
          backgroundUrl: formData.backgroundUrl || undefined,
          topicId: formData.topicId,
        });
      } else {
        await modeClient.insertMode({
          title: formData.title,
          description: formData.description,
          type: formData.type,
          iconUrl: formData.iconUrl || undefined,
          backgroundUrl: formData.backgroundUrl || undefined,
          topicId: formData.topicId,
        });
      }

      resetForm();
      setIsDialogOpen(false);
      loadData();
    } catch (err) {
      newJanusError(err).handle();
    }
  };

  const handleEdit = (mode: ModeWithTopic) => {
    setEditingMode(mode);
    setFormData({
      title: mode.title,
      description: mode.description,
      type: mode.type,
      iconUrl: mode.iconUrl || "",
      backgroundUrl: mode.backgroundUrl || "",
      topicId: mode.topicId,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (modeId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this mode? This will also delete all associated daily games.",
      )
    ) {
      return;
    }

    try {
      await modeClient.deleteMode({ id: modeId });
      loadData();
    } catch (err) {
      newJanusError(err).handle();
    }
  };

  const resetForm = () => {
    setEditingMode(null);
    setFormData({
      title: "",
      description: "",
      type: "",
      iconUrl: "",
      backgroundUrl: "",
      topicId: "",
    });
  };

  if (loading) {
    return <div>Loading modes...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Mode Management</h2>
          <p className="text-muted-foreground">
            Create and manage game modes for your topics
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              New Mode
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingMode ? "Edit Mode" : "Create New Mode"}
              </DialogTitle>
              <DialogDescription>
                {editingMode
                  ? "Update the mode details below."
                  : "Fill in the details to create a new mode."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="topicId" className="text-right">
                    Topic
                  </Label>
                  <Select
                    value={formData.topicId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, topicId: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select game type" />
                    </SelectTrigger>
                    <SelectContent>
                      {GAME_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Label htmlFor="backgroundUrl" className="text-right">
                    Background URL
                  </Label>
                  <Input
                    id="backgroundUrl"
                    value={formData.backgroundUrl}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        backgroundUrl: e.target.value,
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
                  {editingMode ? "Update Mode" : "Create Mode"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Modes ({modes.length})</CardTitle>
          <CardDescription>All game modes across your topics</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mode</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modes.map((mode) => (
                <TableRow key={mode.id}>
                  <TableCell className="font-medium">{mode.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{mode.topicTitle}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge>{mode.type}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {mode.description}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(mode)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(mode.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Link
                        href={`/g/${mode.topicSlug}/${mode.title.toLowerCase()}`}
                        target="_blank"
                      >
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
