"use client";
import { DetailAnswer } from "@/proto/janus/plato/object_pb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";
import { answerClient } from "@/lib/janus/client/plato";
import { newJanusError } from "@/lib/janus/client/error";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "@/lib/toast";
import AnswerCell from "@/components/admin/answer/table/AnswerCell";
import { PlusIcon } from "lucide-react";

type Props = {
  detailAnswers: DetailAnswer[];
  topicId: number;
};

export function DashboardAnswerTable({
  detailAnswers: initialAns,
  topicId,
}: Props) {
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
  const [detailAnswers, setDetailAnswers] =
    useState<DetailAnswer[]>(initialAns);
  const [newRow, setNewRow] = useState(false);
  const [newCol, setNewCol] = useState(false);

  const categoryInputRef = useRef<HTMLInputElement>(null);
  const newAnswerInputRef = useRef<HTMLInputElement>(null);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newAnswerName, setNewAnswerName] = useState("");

  const addAnswer = async (name: string) => {
    if (!name.trim()) {
      showWarningToast("Please enter a valid answer name.");
      return;
    }

    const newAnswer = await answerClient
      .insertAnswer({
        name: name,
        iconUrl: "tes",
        topicId: topicId,
      })
      .catch((err) => {
        newJanusError(err).handle();
      });
    if (!newAnswer) {
      showErrorToast("Failed to add answer.");
      return;
    }

    setDetailAnswers([
      ...detailAnswers,
      {
        answer: newAnswer.answer,
        answerCategories: [],
        $typeName: "plato.DetailAnswer",
      },
    ]);
    showSuccessToast("New answer added successfully.");
  };

  detailAnswers.forEach((answer) => {
    answer.answerCategories.forEach((category) => {
      if (!uniqueCategories.includes(category.name)) {
        uniqueCategories.push(category.name);
      }
    });
  });

  return (
    <div className="relative overflow-auto max-w-full">
      {/* Horizontal Scroll + Plus Bar */}
      <div className="overflow-x-auto relative">
        <div className="flex">
          <Table className="min-w-max">
            <TableHeader>
              <TableRow>
                <TableHead>Answer</TableHead>
                {uniqueCategories.map((category) => (
                  <TableHead key={category}>{category}</TableHead>
                ))}
                {newCol && (
                  <TableHead>
                    <Input
                      ref={categoryInputRef}
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="New Category"
                      className="w-full"
                      onBlur={() => {
                        if (newCategoryName.trim()) {
                          setUniqueCategories([
                            ...uniqueCategories,
                            newCategoryName.trim(),
                          ]);
                        }
                        setNewCol(false);
                        setNewCategoryName("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (newCategoryName.trim()) {
                            setUniqueCategories([
                              ...uniqueCategories,
                              newCategoryName.trim(),
                            ]);
                          }
                          setNewCol(false);
                          setNewCategoryName("");
                        }
                      }}
                    />
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {detailAnswers.map((detailAnswer) => {
                const answerId = detailAnswer.answer?.id;
                if (!answerId) return null;

                return (
                  <TableRow key={answerId}>
                    <TableCell>{detailAnswer?.answer?.name || ""}</TableCell>
                    {uniqueCategories.map((category) => {
                      const categoryData = detailAnswer.answerCategories.find(
                        (c) => c.name === category,
                      );
                      const cellKey = `${answerId}-${category}`;

                      return (
                        <AnswerCell
                          key={cellKey}
                          answerId={answerId}
                          categoryName={category}
                          type={"string"}
                          initialValue={categoryData?.value || ""}
                        />
                      );
                    })}
                    {newCol && (
                      <TableCell
                        className="bg-gray-50 cursor-pointer"
                        onClick={() => {
                          if (!newCategoryName.trim()) {
                            showWarningToast("Please enter a category name.");
                            categoryInputRef.current?.focus();
                          }
                        }}
                      />
                    )}
                  </TableRow>
                );
              })}

              {newRow && (
                <TableRow>
                  <TableCell>
                    <Input
                      ref={newAnswerInputRef}
                      value={newAnswerName}
                      onChange={(e) => setNewAnswerName(e.target.value)}
                      placeholder="New Answer"
                      onBlur={async () => {
                        if (newAnswerName.trim()) {
                          await addAnswer(newAnswerName);
                        }
                        setNewRow(false);
                        setNewAnswerName("");
                      }}
                      onKeyDown={async (e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (newAnswerName.trim()) {
                            await addAnswer(newAnswerName);
                          }
                          setNewRow(false);
                          setNewAnswerName("");
                        }
                      }}
                    />
                  </TableCell>
                  {uniqueCategories.map((_, idx) => (
                    <TableCell key={idx}></TableCell>
                  ))}
                  {newCol && <TableCell />}
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Hoverable vertical bar */}
          <div
            onClick={() => {
              setNewCol(true);
              setTimeout(() => categoryInputRef.current?.focus(), 0);
            }}
            className="group w-6 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors cursor-pointer flex items-center justify-center"
          >
            <PlusIcon className="w-4 h-4 text-gray-600 group-hover:text-black" />
          </div>
        </div>
      </div>

      {/* Bottom horizontal bar */}
      <div
        onClick={() => {
          setNewRow(true);
          setTimeout(() => newAnswerInputRef.current?.focus(), 0);
        }}
        className="flex items-center justify-center h-6 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer mt-1"
      >
        <PlusIcon className="w-4 h-4 text-gray-600 hover:text-black" />
      </div>
    </div>
  );
}
