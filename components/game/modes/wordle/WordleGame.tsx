// components/game/WordleGame.tsx
"use client";

import AnswerSearchBar from "@/components/answer/AnswerSearchBar";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGame } from "@/context/GameContext";
import { newJanusError } from "@/lib/janus/client/error";
import { dailyGameClient } from "@/lib/janus/client/plato";
import { AttemptAnswerResponse } from "@/proto/janus/plato/dailygame_pb";
import { DetailAnswer } from "@/proto/janus/plato/object_pb";
import React, { useRef, useState } from "react";
import { WordleRow } from "./WordleRow"; // Import the new WordleRow component
import getCorrectnessType from "@/helper/game/getCorrectnessType"; // Keep this function
import WordleHelp from "./WordleHelp";

export function WordleGame() {
  const { currentMode, answers, dailyGame } = useGame();
  const [availableAnswers, setAvailableAnswers] = useState(answers);
  const [lastSelectedAnswer, setLastSelectedAnswer] = useState<
    DetailAnswer | undefined
  >(); // Can be undefined
  const [attempts, setAttempts] = useState<AttemptAnswerResponse[]>([]);
  const isLoading = useRef(false);
  const categoryValueMap = new Map<string, Set<string>>();

  availableAnswers.forEach((answer) => {
    answer.answerCategories.forEach((cat) => {
      if (!categoryValueMap.has(cat.name)) {
        categoryValueMap.set(cat.name, new Set());
      }
      categoryValueMap.get(cat.name)!.add(cat.value);
    });
  });

  const categories = Array.from(categoryValueMap.keys());

  async function onSelect(answerId: number) {
    console.log("Selected answer:", answerId);
    if (isLoading.current || lastSelectedAnswer?.answer?.id === answerId)
      return; // Use ===

    isLoading.current = true;
    const selectedAnswer = availableAnswers.find(
      (answer) => answer.answer?.id === answerId,
    );
    setLastSelectedAnswer(selectedAnswer);

    setAvailableAnswers(
      availableAnswers.filter((answer) => answer.answer?.id !== answerId),
    );

    const attemptAnswerResp = await dailyGameClient
      .attemptAnswer({
        dailyGameId: dailyGame.dailyGameId,
        answerId: answerId,
      })
      .catch((err) => {
        newJanusError(err).handle();
        // Only revert if lastSelectedAnswer is defined
        if (selectedAnswer) {
          setAvailableAnswers((prev) => [...prev, selectedAnswer]);
        }
        return null;
      });

    if (!attemptAnswerResp) {
      isLoading.current = false; // Reset loading state on error
      // Revert if lastSelectedAnswer was successfully found
      if (selectedAnswer) {
        setAvailableAnswers((prev) => [...prev, selectedAnswer]);
      }
      return;
    }

    // Add new attempt to the beginning of the array
    setAttempts((prevAttempts) => [attemptAnswerResp, ...prevAttempts]);
    isLoading.current = false;
  }

  const columnCount = categories.length + 1; // +1 for the answer icon column

  const gridCols =
    {
      1: "grid-cols-1 gap-x-1 gap-y-3",
      2: "grid-cols-2 gap-x-1 gap-y-3",
      3: "grid-cols-3 gap-x-1 gap-y-3",
      4: "grid-cols-4 gap-x-1 gap-y-3",
      5: "grid-cols-5 gap-x-1 gap-y-3",
      6: "grid-cols-6 gap-x-1 gap-y-3",
      7: "grid-cols-7 gap-x-1 gap-y-3",
      8: "grid-cols-8 gap-x-1 gap-y-3",
      9: "grid-cols-9 gap-x-1 gap-y-3",
      10: "grid-cols-10",
    }[columnCount] ?? "grid-cols-4";

  const cellWidth = {
    6: "w-full", // Example: if columnCount is 6, cells take full width of their grid slot
  }[columnCount];

  const cellHeight = {
    6: "h-full", // Example: if columnCount is 6, cells take full height of their grid slot
  }[columnCount];

  return (
    <div className="flex flex-col mx-auto">
      <div className="w-[30vw] min-w-96 mx-auto">
        <AnswerSearchBar answers={availableAnswers} onSelect={onSelect} />
      </div>

      <div className={`max-w-[80vw] min-w-[20vw] mx-auto`}>
        <div className={`grid ${gridCols} mt-[5vh] mb-[2vh] items-end`}>
          <div className="text-center font-extrabold cursor-default">
            {currentMode.answerType}
            <Separator className="mt-1 rounded-4xl bg-neutral-300"></Separator>
          </div>
          {categories.map((category) => (
            <div
              key={category}
              className="text-center flex flex-col font-semibold cursor-default"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>{category}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {Array.from(categoryValueMap.get(category) ?? []).join(
                      ", ",
                    )}
                  </p>
                </TooltipContent>
              </Tooltip>
              <Separator className="mt-1 rounded-4xl bg-neutral-300" />
            </div>
          ))}
        </div>

        {/* Scrollable attempts container */}
        <div className={`grid ${gridCols} mt-1`}>
          {/* Use React.Fragment for the overall grid structure */}
          {attempts.map((attempt) => {
            if (!attempt.attemptDetailAnswer?.answer) return null;
            const answer = attempt.attemptDetailAnswer.answer;

            return (
              // Each WordleRow component now represents one full attempt row
              <React.Fragment key={answer.id}>
                <WordleRow
                  attemptAnswer={attempt}
                  categories={categories}
                  cellSizeCss={`${cellWidth} ${cellHeight}`}
                  getCorrectnessType={getCorrectnessType} // Pass the helper function
                />
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <WordleHelp />
    </div>
  );
}
