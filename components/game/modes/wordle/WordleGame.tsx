"use client";

import AnswerSearchBar from "@/components/answer/AnswerSearchBar";
import { useGame } from "@/context/GameContext";
import { newJanusError } from "@/lib/janus/client/error";
import { dailyGameClient } from "@/lib/janus/client/plato";
import { AttemptAnswerResponse } from "@/proto/janus/plato/dailygame_pb";
import { DetailAnswer } from "@/proto/janus/plato/object_pb";
import { useState } from "react";

export function WordleGame() {
  const { topic, modes, currentMode, answers, dailyGame } = useGame();
  const [availableAnswers, setAvailableAnswers] = useState(answers);
  const [lastSelectedAnswer, setLastSelectedAnswer] = useState<DetailAnswer>();
  const [attempts, setAttempts] = useState<AttemptAnswerResponse[]>([]);
  const categories = Array.from(
    new Set(
      availableAnswers.flatMap(answer =>
        answer.answerCategories.map(category => category.name)
      )
    )
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

    setAttempts([...attempts, attemptAnswerResp]);
  }

  return (
    <div className="flex flex-col">
      <AnswerSearchBar answers={availableAnswers} onSelect={onSelect} />
      <div className={`grid grid-cols-${categories.length} gap-4 mt-4`}>

        {categories.map((category) => (
          <div key={category}>{category}</div>
        ))}

          {attempts.map((attempt) => {

            if (!attempt.attemptDetailAnswer?.answer) return null;
            const answer = attempt.attemptDetailAnswer.answer;

            return <div key={answer.id} className="flex w-full h-52 bg-red-400">
              jawa
              
            </div>
          })}
      </div>
    </div>
  );
}
