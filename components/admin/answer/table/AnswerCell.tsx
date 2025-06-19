"use client";

import { useEffect, useRef, useState } from "react";
import { TableCell } from "@/components/ui/table";
import { answerCategoryClient } from "@/lib/janus/client/plato";
import { showSuccessToast } from "@/lib/toast";
import { newJanusError } from "@/lib/janus/client/error";
import { Input } from "@/components/ui/input";

type Props = {
  categoryName: string;
  answerId: number;
  type: string;
  initialValue: string;
};

export default function AnswerCell({
  answerId,
  categoryName,
  initialValue,
}: Props) {
  const [isEditing, setEditing] = useState<{
    id: number;
    category: string;
  } | null>(null);
  const [value, setValue] = useState(initialValue);
  const [isUpdating, setIsUpdating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle starting edit mode
  const startEditing = (id: number, category: string, initialValue: string) => {
    setEditing({ id, category });
    setValue(initialValue);
  };

  // Handle saving changes
  const saveChanges = async () => {
    if (!isEditing || value === "") return;

    setIsUpdating(true);
    try {
      await answerCategoryClient.insertAnswerCategory({
        name: categoryName,
        value: value,
        answerId: answerId,
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
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <TableCell
      onClick={() => startEditing(answerId, categoryName, value)}
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
        <div className="min-h-[2rem] flex items-center">{value}</div>
      )}
    </TableCell>
  );
}
