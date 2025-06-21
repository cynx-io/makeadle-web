"use client";

import AnswerSearchBar from "@/components/answer/AnswerSearchBar";
import { Separator } from "@/components/ui/separator";
import { useGame } from "@/context/GameContext";
import { newJanusError } from "@/lib/janus/client/error";
import { dailyGameClient } from "@/lib/janus/client/plato";
import { AttemptAnswerResponse } from "@/proto/janus/plato/dailygame_pb";
import { DetailAnswer } from "@/proto/janus/plato/object_pb";
import Image from "next/image";
import React, { useRef, useState } from "react";

export function WordleGame() {
  const { currentMode, answers, dailyGame } = useGame();
  const [availableAnswers, setAvailableAnswers] = useState(answers);
  const [lastSelectedAnswer, setLastSelectedAnswer] = useState<DetailAnswer>();
  const [attempts, setAttempts] = useState<AttemptAnswerResponse[]>([]);
  const isLoading = useRef(false);
  const categories = Array.from(
    new Set(
      availableAnswers.flatMap((answer) =>
        answer.answerCategories.map((category) => category.name),
      ),
    ),
  );

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

  const columnCount = categories.length + 2;

  const gridCols =
    {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5 gap-3",
      6: "grid-cols-6",
      7: "grid-cols-7",
      8: "grid-cols-8",
      9: "grid-cols-9",
      10: "grid-cols-10",
    }[columnCount] ?? "grid-cols-4";

  const cellWidth = {
    5: "w-[90px]",
  }[columnCount];

  const cellHeight = {
    5: "h-[70px]",
  }[columnCount];

  return (
    <div className="flex flex-col mx-auto">
      <div className="w-[50vw] min-w-96 mx-auto">
        <AnswerSearchBar answers={availableAnswers} onSelect={onSelect} />
      </div>

      <div className={`max-w-[80vw] min-w-[20vw] mx-auto`}>
        {/* Header row: fixed, no scroll */}
        <div className={`grid ${gridCols} mt-[5vh] mb-[2vh]`}>
          <div className="text-center col-span-2 font-extrabold">
            {currentMode.answerType}
            <Separator className="mt-1 rounded-4xl bg-neutral-300"></Separator>
          </div>
          {categories.map((category) => (
            <div key={category} className={`text-center font-semibold `}>
              <div className={`${cellWidth} mx-auto`}>{category}</div>
              <Separator className="mt-1 rounded-4xl bg-neutral-300"></Separator>
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
                <div className="flex w-full col-span-2 mx-4 pr-6 relative z-0">
                  <div className=" flex w-full py-1 px-2 gap-2 bg-neutral-700/50 rounded-md">
                    <Image
                      src={answer.iconUrl ?? "/img/invalid.png"}
                      alt={answer.name}
                      width={50}
                      height={50}
                      className="object-contain"
                    />
                    <div className="my-auto font-extrabold text-2xl">
                      {answer.name}
                    </div>
                  </div>
                </div>

                {categories.map((category) => {
                  const answerCategory =
                    attempt.attemptDetailAnswer?.answerCategories.findLast(
                      (c) => c.name == category,
                    );
                  if (answerCategory == undefined) {
                    return <div key={category}></div>;
                  }
                  let bgColor = "bg-red-500";

                  switch (answerCategory.correctness) {
                    case 0:
                      // continue without change, red default
                      break;
                    case 1:
                      bgColor = "bg-yellow-500";
                      break;
                    case 2:
                      bgColor = "bg-green-500";
                      break;
                  }

                  return (
                    <div
                      key={category}
                      className={`text-center rounded-xs my-auto mx-auto justify-center flex items-center ${bgColor} ${cellHeight} ${cellWidth} border-2 text-shadow-2xs`}
                    >
                      {answerCategory?.value}
                    </div>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
