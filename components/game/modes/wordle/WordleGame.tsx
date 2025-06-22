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
import Image from "next/image";
import React, { useRef, useState } from "react";
import { CorrectnessType } from "@/types/game/correctnessType";
import { CategorySquare } from "./CategorySquare";
import getCorrectnessType from "@/helper/game/getCorrectnessType";

export function WordleGame() {
  const { currentMode, answers, dailyGame } = useGame();
  const [availableAnswers, setAvailableAnswers] = useState(answers);
  const [lastSelectedAnswer, setLastSelectedAnswer] = useState<DetailAnswer>();
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
    if (isLoading.current || lastSelectedAnswer?.answer?.id == answerId) return;

    isLoading.current = true;
    setLastSelectedAnswer(
      availableAnswers.find((answer) => answer.answer?.id === answerId),
    );

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
        setAvailableAnswers([...availableAnswers, lastSelectedAnswer!]);
        return null;
      });

    if (!attemptAnswerResp) {
      setAvailableAnswers([...availableAnswers, lastSelectedAnswer!]);
      return;
    }

    attempts.unshift(attemptAnswerResp);
    setAttempts([...attempts]);
    isLoading.current = false;
  }

  const columnCount = categories.length + 1;

  const gridCols =
    {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4 gap-x-1 gap-y-2",
      5: "grid-cols-5 gap-x-1 gap-y-2",
      6: "grid-cols-6 gap-x-1 gap-y-2",
      7: "grid-cols-7 gap-x-1 gap-y-2",
      8: "grid-cols-8 gap-x-1 gap-y-2",
      9: "grid-cols-9 gap-x-1 gap-y-2",
      10: "grid-cols-10",
    }[columnCount] ?? "grid-cols-4";

  const cellWidth = {
    6: "w-full",
  }[columnCount];

  const cellHeight = {
    6: "h-full",
  }[columnCount];

  return (
    <div className="flex flex-col mx-auto">
      <div className="w-[30vw] min-w-96 mx-auto">
        <AnswerSearchBar answers={availableAnswers} onSelect={onSelect} />
      </div>

      <div className={`max-w-[80vw] min-w-[20vw] mx-auto`}>
        {/* Header row: fixed, no scroll */}
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
              {(() => {
                const possibleValues = Array.from(
                  categoryValueMap.get(category) ?? [],
                );

                return (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>{category}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{possibleValues.join(", ")}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })()}

              <Separator className="mt-1 rounded-4xl bg-neutral-300" />
            </div>
          ))}
        </div>

        {/* Scrollable attempts container */}
        <div className={`grid ${gridCols} mt-1`}>
          {attempts.map((attempt) => {
            if (!attempt.attemptDetailAnswer?.answer) return null;
            const answer = attempt.attemptDetailAnswer.answer;

            return (
              <React.Fragment key={answer.id}>
                  <div className={`flex w-full ${cellWidth} ${cellHeight}`}>
                    <Tooltip>
                      <TooltipTrigger>
                        <Image
                          src={answer.iconUrl ?? "/img/invalid.png"}
                          alt={answer.name}
                          width={100}
                          height={100}
                          className="object-contain border-2"
                        />
                      </TooltipTrigger>

                      <TooltipContent>
                        <p>{answer.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {categories.map((category) => {
                    const matchedCategories =
                      attempt.attemptDetailAnswer?.answerCategories.filter(
                        (c) => c.name === category,
                      ) ?? [];
                    if (matchedCategories.length === 0) {
                      return (
                        <CategorySquare
                          key={category}
                          category={category}
                          cellSizeCss="w-full h-full"
                          type={CorrectnessType.UNKNOWN}
                          value={"x"}
                        />
                      );
                    }
                    const categoryType = matchedCategories[0]?.type ?? "string";
                    const maxCorrectness = Math.max(
                      ...matchedCategories.map((c) => c.correctness),
                    );

                    const correctnessType = getCorrectnessType(
                      categoryType,
                      maxCorrectness,
                    );
                    return (
                      <CategorySquare
                        key={category}
                        category={category}
                        cellSizeCss="w-full h-full"
                        type={correctnessType}
                        value={matchedCategories.map((c) => c.value).join(", ")}
                      />
                    );
                  })}
                  <Separator className="col-span-6 bg-neutral-500/30" />
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="border-2 mt-20 py-4 mx-auto from-sky-950 bg-gradient-to-br to-blue-950 rounded-md sm:w-96 w-[90%]">
        <h3 className="text-center">Color Indicator</h3>
        <div className="flex gap-5 justify-center mt-5">
          <span className="flex flex-col items-center">
            <div className="bg-green-600 w-8 h-8"></div>
            <p>Correct</p>
          </span>
          <span className="flex flex-col items-center">
            <div className="bg-red-700 w-8 h-8"></div>
            <p>Incorrect</p>
          </span>
          <span className="flex flex-col items-center">
            <div className="bg-orange-600 w-8 h-8"></div>
            <p>Partial</p>
          </span>
        </div>
      </div>
    </div>
  );
}
