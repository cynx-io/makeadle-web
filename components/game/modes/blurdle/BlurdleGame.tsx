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
import { BlurdleCell } from "@/components/game/modes/blurdle/BlurdleCell";
import Image from "next/image";

export type BlurdleGameProps = {
  attempts: AttemptDetailAnswer[];
  setAttempts: React.Dispatch<React.SetStateAction<AttemptDetailAnswer[]>>;
  clues: Clue[];
  setClues: React.Dispatch<React.SetStateAction<Clue[]>>;
};

export function BlurdleGame({
  attempts,
  setAttempts,
  clues,
  setClues,
}: Readonly<BlurdleGameProps>) {
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
  const [imageLoaded, setImageLoaded] = useState(false);

  // Calculate blur amount based on attempts
  const calculateBlur = (attemptCount: number): number => {
    // Start with maximum blur and decrease as attempts increase
    const maxBlur = 20; // Maximum blur in pixels
    const minBlur = 0; // Minimum blur (fully clear)
    const maxAttempts = 10; // Adjust based on your game design

    // Progressive blur reduction: more attempts = less blur
    const blurAmount = Math.max(
      minBlur,
      maxBlur - attemptCount * (maxBlur / maxAttempts),
    );
    return blurAmount;
  };

  // Alternative: Step-based blur reduction
  const calculateStepBlur = (attemptCount: number): number => {
    const blurSteps = [15, 13, 10, 8, 6, 4, 2, 1, 0.5, 0]; // Blur values for each attempt
    return blurSteps[Math.min(attemptCount, blurSteps.length - 1)] || 0;
  };

  // Calculate saturation (color) based on attempts
  const calculateSaturation = (attemptCount: number): number => {
    // Start with no color (0%) and increase to full color (100%)
    const maxAttempts = 10; // Should match your blur steps
    const saturation = Math.min(100, (attemptCount / maxAttempts) * 100);
    return saturation;
  };

  // Step-based saturation for more dramatic color changes
  const calculateStepSaturation = (attemptCount: number): number => {
    const saturationSteps = [0, 10, 20, 30, 45, 60, 75, 85, 95, 100]; // Saturation percentages
    return (
      saturationSteps[Math.min(attemptCount, saturationSteps.length - 1)] || 0
    );
  };

  // Calculate brightness for additional visual progression
  const calculateBrightness = (attemptCount: number): number => {
    // Start slightly darker and increase to normal brightness
    const minBrightness = 60; // Start at 60% brightness
    const maxBrightness = 100; // Normal brightness
    const maxAttempts = 10;

    const brightness = Math.min(
      maxBrightness,
      minBrightness +
        (attemptCount / maxAttempts) * (maxBrightness - minBrightness),
    );
    return brightness;
  };

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

  // Reset image loaded state when clues change (mode switch)
  useEffect(() => {
    setImageLoaded(false);
  }, [clues]);

  async function onSelect(answerId: number) {
    console.log("Selected answer:", answerId);
    if (isLoading.current || lastSelectedAnswer?.id === answerId) return;

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

  // Calculate current blur amount and color progression
  const currentBlur = calculateStepBlur(attempts.length);
  const currentSaturation = calculateStepSaturation(attempts.length);
  const currentBrightness = calculateBrightness(attempts.length);

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
                {clue.type === "image" ? (
                  <div className="relative min-w-[20vw] mx-auto">
                    {!imageLoaded && (
                      <div className="min-w-[20vw] h-[300px] mx-auto flex items-center justify-center bg-gray-800 rounded-lg">
                        <div className="text-white">Loading...</div>
                      </div>
                    )}
                    <Image
                      width={300}
                      height={300}
                      src={clue.value}
                      alt="Blurred game image"
                      priority={true}
                      className={`min-w-[20vw] mx-auto transition-all duration-500 ease-in-out hover:scale-110 rounded-lg ${
                        imageLoaded ? "opacity-100" : "opacity-0"
                      }`}
                      style={{
                        filter: `blur(${currentBlur}px) saturate(${currentSaturation}%) brightness(${currentBrightness}%)`,
                        WebkitFilter: `blur(${currentBlur}px) saturate(${currentSaturation}%) brightness(${currentBrightness}%)`, // Safari support
                      }}
                      onLoad={() => {
                        setImageLoaded(true);
                      }}
                      onError={() => {
                        console.warn(
                          "Failed to load blurdle image:",
                          clue.value,
                        );
                        setImageLoaded(true); // Show error state
                      }}
                    />
                    {imageLoaded &&
                      (currentBlur > 0 || currentSaturation < 100) && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                          <div>Blur: {currentBlur.toFixed(1)}px</div>
                          <div>Color: {currentSaturation.toFixed(0)}%</div>
                        </div>
                      )}
                  </div>
                ) : (
                  <span className="text-lg font-semibold">{clue.value}</span>
                )}
              </div>
            );
          })}
        </div>

        <AnswerSearchBar answers={availableAnswers} onSelect={onSelect} />

        {/* Optional: Show attempt progress with visual indicators */}
        <div className="text-center text-sm text-gray-600 mb-2">
          <div className="flex justify-center items-center gap-4 mb-1">
            <span>Attempts: {attempts.length}</span>
            <span>Blur: {currentBlur.toFixed(1)}px</span>
            <span>Color: {currentSaturation.toFixed(0)}%</span>
          </div>

          {/* Visual progress bar */}
          <div className="w-full max-w-md mx-auto">
            <div className="flex justify-between text-xs mb-1 text-white font-extrabold">
              <span>Noob</span>
              <span>Pro</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-gray-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${100 - (attempts.length / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex flex-row flex-wrap w-full items-start justify-start">
          {attempts.length > 0 &&
            attempts.map((attempt, index) => {
              const answer = attempt.answer;
              if (!answer) return null;

              return (
                <BlurdleCell
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

      {/* <BlurdleHelp /> */}
    </div>
  );
}
