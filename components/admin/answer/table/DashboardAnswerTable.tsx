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
import { useState, useEffect, useRef } from "react";
import { answerCategoryClient, answerClient } from "@/lib/janus/client/plato";
import { JanusError, newJanusError } from "@/lib/janus/error";
import { showSuccessToast } from "@/lib/toast";

type Props = {
  detailAnswers: DetailAnswer[];
};

export function DashboardAnswerTable({ detailAnswers }: Props) {
  const [editing, setEditing] = useState<{
    id: bigint;
    category: string;
  } | null>(null);
  const [value, setValue] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uniqueCategories: string[] = [];
  detailAnswers.forEach((answer) => {
    answer.answerCategories.forEach((category) => {
      if (!uniqueCategories.includes(category.name)) {
        uniqueCategories.push(category.name);
      }
    });
  });

  // Handle starting edit mode
  const startEditing = (id: bigint, category: string, initialValue: string) => {
    setEditing({ id, category });
    setValue(initialValue);
  };

  // Handle saving changes
  const saveChanges = async () => {
    if (!editing || value === "") return;

    setIsUpdating(true);
    try {
      await answerCategoryClient.insertAnswerCategory({
        name: editing.category,
        value: value,
        answerId: editing.id,
        type: "string",
      });
      showSuccessToast("Changes Saved");
    } catch (err) {
      console.error("Failed to update:", err);
      newJanusError(err).handle();
      // Handle error (e.g., show toast notification)
    } finally {
      setIsUpdating(false);
      setEditing(null);
    }
  };

  // Handle key events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveChanges();
    } else if (e.key === "Escape") {
      setEditing(null);
    }
  };

  // Focus input when editing starts
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Answer</TableHead>
          {uniqueCategories.map((category) => (
            <TableHead key={category}>{category}</TableHead>
          ))}
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
                const isEditing =
                  editing?.id == answerId && editing?.category === category;
                const displayValue = categoryData?.value || "";

                return (
                  <TableCell
                    key={cellKey}
                    onClick={() =>
                      startEditing(answerId, category, displayValue)
                    }
                    className="cursor-pointer"
                  >
                    {isEditing ? (
                      <Input
                        ref={inputRef}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={saveChanges}
                        onKeyDown={handleKeyDown}
                        disabled={isUpdating}
                        className="w-full h-8"
                      />
                    ) : (
                      <div className="min-h-[2rem] flex items-center">
                        {displayValue}
                      </div>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
