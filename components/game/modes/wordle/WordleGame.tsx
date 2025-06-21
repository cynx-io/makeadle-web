"use client";

import AnswerSearchBar from "@/components/answer/AnswerSearchBar";
import { useGame } from "@/context/GameContext";
import { newJanusError } from "@/lib/janus/client/error";
import { dailyGameClient } from "@/lib/janus/client/plato";
import { AttemptAnswerResponse } from "@/proto/janus/plato/dailygame_pb";
import { DetailAnswer } from "@/proto/janus/plato/object_pb";
import Image from "next/image";
import React, { useState } from "react";

export function WordleGame() {
  const { topic, modes, currentMode, answers, dailyGame } = useGame();
  const [availableAnswers, setAvailableAnswers] = useState(answers);
  const [lastSelectedAnswer, setLastSelectedAnswer] = useState<DetailAnswer>();
  const [attempts, setAttempts] = useState<AttemptAnswerResponse[]>([]);
  const categories = Array.from(
    new Set(
      availableAnswers.flatMap((answer) =>
        answer.answerCategories.map((category) => category.name),
      ),
    ),
  );

  async function onSelect(answerId: number) {
    console.log("Selected answer:", answerId);
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

    attempts.unshift(attemptAnswerResp)
    setAttempts([...attempts]);
  }

  const gridCols = `grid-cols-${categories.length + 2}`;

  return (
    <div className="flex flex-col w-[50vw] mx-auto">
      <AnswerSearchBar answers={availableAnswers} onSelect={onSelect} />

      {/* Header row: fixed, no scroll */}
      <div className={`grid ${gridCols} gap-2 gap-x-20 mt-4 px-5`}>
        <div className="text-center col-span-2">{currentMode.answerType}</div>
        {categories.map((category) => (
          <div key={category} className="text-center font-bold">
            {category}
          </div>
        ))}
      </div>

      {/* Scrollable attempts container */}
      <div
        className={`grid ${gridCols} gap-2 gap-x-20 mt-1 px-5`}
      >
        {attempts.map((attempt) => {
          if (!attempt.attemptDetailAnswer?.answer) return null;
          const answer = attempt.attemptDetailAnswer.answer;

          return (
            <React.Fragment key={answer.id}>
              <div className="flex gap-3 w-full col-span-2">
                <Image
                  src={answer.iconUrl ?? "/img/invalid.png"}
                  alt={answer.name}
                  width={50}
                  height={50}
                  className="object-contain"
                />
                <div className="my-auto font-extrabold text-2xl">{answer.name}</div>
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
                  <div key={category} className={`text-center my-auto ${bgColor}`}>
                    {answerCategory?.value}
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}