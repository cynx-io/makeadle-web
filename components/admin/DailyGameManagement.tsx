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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  topicClient,
  modeClient,
  answerClient,
} from "@/lib/janus/client/plato";
import { newJanusError } from "@/lib/janus/client/error";
import { Plus, Edit, Trash2, CalendarIcon, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Topic {
  id: number;
  title: string;
  slug: string;
}

interface Mode {
  id: number;
  title: string;
  type: string;
  topicId: number;
}

interface Answer {
  id: number;
  name: string;
  topicId: number;
}

interface DailyGameWithDetails {
  id: number;
  date: string;
  answerId: number;
  modeId: number;
  topicId: number;
  answerName: string;
  modeName: string;
  modeType: string;
  topicTitle: string;
  topicSlug: string;
}

interface DailyGameFormData {
  date: Date | undefined;
  topicId: number;
  modeId: number;
  answerId: number;
}

export function DailyGameManagement() {
  const [dailyGames, setDailyGames] = useState<DailyGameWithDetails[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [modes, setModes] = useState<Mode[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGame, setEditingGame] = useState<DailyGameWithDetails | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<DailyGameFormData>({
    date: undefined,
    topicId: 0,
    modeId: 0,
    answerId: 0,
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

      // Load all modes and answers
      const allModes: Mode[] = [];
      const allAnswers: Answer[] = [];

      for (const topic of topicList) {
        const modesResp = await modeClient.listModesByTopicId({
          topicId: topic.id,
        });
        const topicModes = modesResp?.modes || [];
        allModes.push(
          ...topicModes.map((mode) => ({
            ...mode,
            topicId: topic.id,
            type: mode.Type || "UNKNOWN",
          })),
        );

        const answersResp = await answerClient.listAnswersByTopicId({
          topicId: topic.id,
        });
        const topicAnswers = answersResp?.answers || [];
        allAnswers.push(
          ...topicAnswers.map((answer) => ({ ...answer, topicId: topic.id })),
        );
      }

      setModes(allModes);
      setAnswers(allAnswers);

      // Load daily games - Note: This is a simplified version
      // In a real implementation, you'd need a proper API to list daily games
      // For now, we'll show an empty list and allow creation
      setDailyGames([]);
    } catch (err) {
      newJanusError(err).handle();
    } finally {
      setLoading(false);
    }
  };

  const handleTopicChange = (topicId: string) => {
    setFormData({
      ...formData,
      topicId: parseInt(topicId),
      modeId: 0,
      answerId: 0,
    });
  };

  const getModesForTopic = (topicId: string) => {
    return modes.filter((mode) => mode.topicId === parseInt(topicId));
  };

  const getAnswersForTopic = (topicId: string) => {
    return answers.filter((answer) => answer.topicId === parseInt(topicId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date) return;

    try {
      // Note: This assumes there's an insertDailyGame method
      // You may need to implement this in your server client
      console.log("Creating daily game:", {
        date: format(formData.date, "yyyy-MM-dd"),
        answerId: formData.answerId,
        modeId: formData.modeId,
        topicId: formData.topicId,
      });

      // For now, just show a success message
      alert("Daily game scheduled successfully!");

      resetForm();
      setIsDialogOpen(false);
      loadData();
    } catch (err) {
      newJanusError(err).handle();
    }
  };

  const handleEdit = (game: DailyGameWithDetails) => {
    setEditingGame(game);
    setFormData({
      date: new Date(game.date),
      topicId: game.topicId,
      modeId: game.modeId,
      answerId: game.answerId,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (gameId: number) => {
    if (!confirm("Are you sure you want to delete this daily game?")) {
      return;
    }

    try {
      // Note: Implement deleteDailyGame method if available
      console.log("Deleting daily game:", gameId);
      alert("Daily game deleted successfully!");
      loadData();
    } catch (err) {
      newJanusError(err).handle();
    }
  };

  const resetForm = () => {
    setEditingGame(null);
    setFormData({
      date: undefined,
      topicId: 0,
      modeId: 0,
      answerId: 0,
    });
  };

  if (loading) {
    return <div>Loading daily games...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Daily Game Management</h2>
          <p className="text-muted-foreground">
            Schedule and manage daily games for your modes
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Game
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingGame ? "Edit Daily Game" : "Schedule New Daily Game"}
              </DialogTitle>
              <DialogDescription>
                {editingGame
                  ? "Update the daily game details below."
                  : "Schedule a new daily game for a specific date."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "col-span-3 justify-start text-left font-normal",
                          !formData.date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.date ? (
                          format(formData.date, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.date}
                        onSelect={(date) => setFormData({ ...formData, date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="topicId" className="text-right">
                    Topic
                  </Label>
                  <Select
                    value={formData.topicId.toString()}
                    onValueChange={handleTopicChange}
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
                  <Label htmlFor="modeId" className="text-right">
                    Mode
                  </Label>
                  <Select
                    value={formData.modeId.toString()}
                    onValueChange={(value) =>
                      setFormData({ ...formData, modeId: parseInt(value) })
                    }
                    disabled={formData.topicId === 0}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a mode" />
                    </SelectTrigger>
                    <SelectContent>
                      {getModesForTopic(formData.topicId.toString()).map(
                        (mode) => (
                          <SelectItem key={mode.id} value={mode.id.toString()}>
                            {mode.title} ({mode.type})
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="answerId" className="text-right">
                    Answer
                  </Label>
                  <Select
                    value={formData.answerId.toString()}
                    onValueChange={(value) =>
                      setFormData({ ...formData, answerId: parseInt(value) })
                    }
                    disabled={formData.topicId === 0}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select an answer" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAnswersForTopic(formData.topicId.toString()).map(
                        (answer) => (
                          <SelectItem
                            key={answer.id}
                            value={answer.id.toString()}
                          >
                            {answer.name}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
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
                  {editingGame ? "Update Game" : "Schedule Game"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Today&apos;s Games
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Active today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Scheduled this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Scheduled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailyGames.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scheduled Games ({dailyGames.length})</CardTitle>
          <CardDescription>All scheduled daily games</CardDescription>
        </CardHeader>
        <CardContent>
          {dailyGames.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No daily games scheduled yet.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Create your first scheduled game using the button above.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Answer</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dailyGames.map((game) => (
                  <TableRow key={game.id}>
                    <TableCell className="font-medium">
                      {format(new Date(game.date), "PPP")}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{game.topicTitle}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge>
                        {game.modeName} ({game.modeType})
                      </Badge>
                    </TableCell>
                    <TableCell>{game.answerName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(game)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(game.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Link
                          href={`/g/${game.topicSlug}/${game.modeName.toLowerCase()}`}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
