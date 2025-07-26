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
import {
  topicClient,
  answerClient,
  answerCategoryClient,
} from "@/lib/janus/client/plato";
import { newJanusError } from "@/lib/janus/client/error";
import { Plus, Edit, Trash2, Search } from "lucide-react";

interface Topic {
  id: number;
  title: string;
  slug: string;
}

interface AnswerWithTopic {
  id: number;
  name: string;
  iconUrl?: string;
  answerType: string;
  topicId: number;
  topicTitle: string;
  topicSlug: string;
  categoriesCount: number;
}

interface AnswerFormData {
  name: string;
  iconUrl: string;
  answerType: string;
  topicId: number;
}

const ANSWER_TYPES = [
  { label: "Character", value: "CHARACTER" },
  { label: "Item", value: "ITEM" },
  { label: "Location", value: "LOCATION" },
  { label: "Skill", value: "SKILL" },
  { label: "Other", value: "OTHER" },
];

export function AnswerManagement() {
  const [answers, setAnswers] = useState<AnswerWithTopic[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAnswer, setEditingAnswer] = useState<AnswerWithTopic | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [formData, setFormData] = useState<AnswerFormData>({
    name: "",
    iconUrl: "",
    answerType: "",
    topicId: 0,
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

      // Load answers for all topics
      const allAnswers: AnswerWithTopic[] = [];
      for (const topic of topicList) {
        const answersResp = await answerClient.listAnswersByTopicId({
          topicId: topic.id,
        });
        const topicAnswers = answersResp?.answers || [];

        for (const answer of topicAnswers) {
          // Get category count for each answer
          const categoriesResp =
            await answerCategoryClient.listAnswerCategoriesByAnswerId({
              answerId: answer.id,
            });
          const categoriesCount = categoriesResp?.answerCategories?.length || 0;

          allAnswers.push({
            ...answer,
            topicId: topic.id,
            topicTitle: topic.title,
            topicSlug: topic.slug,
            categoriesCount,
          });
        }
      }

      setAnswers(allAnswers);
    } catch (err) {
      newJanusError(err).handle();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAnswer) {
        await answerClient.updateAnswer({
          answerId: editingAnswer.id,
          name: formData.name,
          iconUrl: formData.iconUrl || undefined,
          AnswerType: formData.answerType,
        });
      } else {
        await answerClient.insertAnswer({
          name: formData.name,
          iconUrl: formData.iconUrl || undefined,
          AnswerType: formData.answerType,
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

  const handleEdit = (answer: AnswerWithTopic) => {
    setEditingAnswer(answer);
    setFormData({
      name: answer.name,
      iconUrl: answer.iconUrl || "",
      answerType: answer.answerType,
      topicId: answer.topicId,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (answerId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this answer? This will also delete all associated categories.",
      )
    ) {
      return;
    }

    try {
      await answerClient.deleteAnswer({ answerId });
      loadData();
    } catch (err) {
      newJanusError(err).handle();
    }
  };

  const resetForm = () => {
    setEditingAnswer(null);
    setFormData({
      name: "",
      iconUrl: "",
      answerType: "",
      topicId: 0,
    });
  };

  const filteredAnswers = answers.filter((answer) => {
    const matchesSearch = answer.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTopic =
      selectedTopic === "all" || answer.topicId.toString() === selectedTopic;
    return matchesSearch && matchesTopic;
  });

  if (loading) {
    return <div>Loading answers...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Answer Management</h2>
          <p className="text-muted-foreground">
            Create and manage answers for your topics
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              New Answer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingAnswer ? "Edit Answer" : "Create New Answer"}
              </DialogTitle>
              <DialogDescription>
                {editingAnswer
                  ? "Update the answer details below."
                  : "Fill in the details to create a new answer."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="topicId" className="text-right">
                    Topic
                  </Label>
                  <Select
                    value={formData.topicId.toString()}
                    onValueChange={(value) =>
                      setFormData({ ...formData, topicId: parseInt(value) })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {topics.map((topic) => (
                        <SelectItem key={topic.id} value={topic.id.toString()}>
                          {topic.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="answerType" className="text-right">
                    Type
                  </Label>
                  <Select
                    value={formData.answerType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, answerType: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select answer type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ANSWER_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  {editingAnswer ? "Update Answer" : "Create Answer"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search answers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedTopic} onValueChange={setSelectedTopic}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by topic" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Topics</SelectItem>
            {topics.map((topic) => (
              <SelectItem key={topic.id} value={topic.id.toString()}>
                {topic.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Answers ({filteredAnswers.length})</CardTitle>
          <CardDescription>All answers across your topics</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAnswers.map((answer) => (
                <TableRow key={answer.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {answer.iconUrl && (
                        <img
                          src={answer.iconUrl}
                          alt={answer.name}
                          className="w-6 h-6 rounded"
                        />
                      )}
                      {answer.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{answer.topicTitle}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge>{answer.answerType}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {answer.categoriesCount} categories
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(answer)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(answer.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
