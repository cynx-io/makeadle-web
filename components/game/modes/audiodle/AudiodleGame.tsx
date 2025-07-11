"use client";

import AnswerSearchBar from "@/components/answer/AnswerSearchBar";
import { useGame } from "@/context/GameContext";
import { newJanusError } from "@/lib/janus/client/error";
import { dailyGameClient } from "@/lib/janus/client/plato";
import {
  Answer,
  AttemptDetailAnswer,
  Clue,
} from "@/proto/janus/plato/object_pb";
import React, { useEffect, useRef, useState } from "react";
import AudioPlayer from "./AudioPlayer";
import { AudiodleCell } from "@/components/game/modes/audiodle/AudiodleCell";

export type AudiodleGameProps = {
  attempts: AttemptDetailAnswer[];
  setAttempts: React.Dispatch<React.SetStateAction<AttemptDetailAnswer[]>>;
  clues: Clue[];
  setClues: React.Dispatch<React.SetStateAction<Clue[]>>;
};

export function AudiodleGame({
  attempts,
  setAttempts,
  clues,
  setClues,
}: Readonly<AudiodleGameProps>) {
  const { currentMode, answers, dailyGame, gameOver, setGameOver } = useGame();
  const [availableAnswers, setAvailableAnswers] = useState<Answer[]>(
    answers.filter((ans) => {
      return currentMode.answerTypes.includes(ans.answerType ?? "");
    }),
  );

  const [lastSelectedAnswer, setLastSelectedAnswer] = useState<
    Answer | undefined
  >();
  const isLoading = useRef(false);

  useEffect(() => {
    setAvailableAnswers(
      answers.filter((ans) => {
        let isValid = currentMode.answerTypes.includes(ans.answerType ?? "");
        if (!isValid) {
          return isValid;
        }

        isValid =
          attempts.filter((attempt) => {
            return attempt.answer?.id === ans.id;
          }).length === 0;

        return isValid;
      }),
    );
  }, [attempts]);

  async function onSelect(answerId: number) {
    console.log("Selected answer:", answerId);
    if (isLoading.current || lastSelectedAnswer?.id === answerId) return; // Use ===

    isLoading.current = true;
    const selectedAnswer = availableAnswers.find(
      (answer) => answer.id === answerId,
    );
    setLastSelectedAnswer(selectedAnswer);

    const attemptAnswerResp = await dailyGameClient
      .attemptAnswer({
        dailyGameId: dailyGame.dailyGameId,
        answerId: answerId,
      })
      .catch((err) => {
        newJanusError(err).handle();
        return null;
      });

    if (!attemptAnswerResp) {
      isLoading.current = false;
      return;
    }

    if (attemptAnswerResp.attemptDetailAnswer?.isCorrect) setGameOver(true);

    setClues(attemptAnswerResp.clues);

    // Add new attempt to the beginning of the array
    setAttempts((prevAttempts) => {
      if (!attemptAnswerResp.attemptDetailAnswer) {
        return prevAttempts;
      }
      return [attemptAnswerResp.attemptDetailAnswer, ...prevAttempts];
    });
    isLoading.current = false;
  }

  return (
    <div className="flex flex-col mx-auto">
      <div className="w-[30vw] min-w-96 mx-auto"></div>

      <div className={`w-[30vw] mx-auto flex flex-col gap-5`}>
        <div className="flex flex-col w-2/3 mx-auto">
          {clues.map((clue, index) => {
            return (
              <div
                key={`${clue.name}-${index}`}
                className="flex items-center gap-2"
              >
                {clue.type === "audio" ? (
                  <AudioPlayer audioUrl={clue.value} />
                ) : (
                  <span className="text-lg font-semibold">{clue.value}</span>
                )}
              </div>
            );
          })}
        </div>

        <AnswerSearchBar answers={availableAnswers} onSelect={onSelect} />
        <div className="flex flex-row flex-wrap w-full items-start justify-start">
          {attempts.length > 0 &&
            attempts.map((attempt, index) => {
              const answer = attempt.answer;
              if (!answer) return null;

              return (
                <AudiodleCell
                  tooltipValue={answer.name}
                  cellSizeCss={"w-20 h-20"}
                  iconUrl={answer.iconUrl ?? "img/invalid.png"}
                  isCorrect={attempt.isCorrect}
                  key={answer.id}
                />
              );
            })}
        </div>
      </div>

      {/* <AudiodleHelp /> */}
    </div>
  );
}
