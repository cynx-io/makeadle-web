"use client";

import { useGame } from "@/context/GameContext";
import { WordleGame } from "./modes/wordle/WordleGame";

export function GameSection() {
  const { topic, modes, currentMode } = useGame();

  switch (currentMode.Type) {
    case "WORDLE":
      return <WordleGame />;
    default:
      return <div>Unsupported game mode: {currentMode.Type}</div>;
  }
}
