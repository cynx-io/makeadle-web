"use client";

import AnswerSearchBar from "@/components/answer/AnswerSearchBar";
import { useGame } from "@/context/GameContext";

export function WordleGame() {
  const { topic, modes, currentMode, answers, dailyGame } = useGame();

  function onSelect(answerId: number) {
    console.log("Selected answer:", answerId);
  }

  return (
    <div className="flex flex-col">
      <h1>wordle</h1>

      <AnswerSearchBar answers={answers} onSelect={onSelect} />
    </div>
  );
}
