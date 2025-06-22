"use client";

import { useGame } from "@/context/GameContext";
import { WordleGame } from "./modes/wordle/WordleGame";
import { useState } from "react";
import { Mode } from "@/proto/janus/plato/object_pb";

export function GameSection() {
  const { currentMode, modes } = useGame();
  const [isGameOver, setIsGameOver] = useState(false);
  const [nextMode, setNextMode] = useState<Mode>();

  const onGameOver = () => {
    setIsGameOver(true);
  };

  return (
    <div>
      {(() => {
        switch (currentMode.Type) {
          case "WORDLE":
            return <WordleGame />;
          default:
            return <div>Unsupported game mode: {currentMode.Type}</div>;
        }
      })()}

      {isGameOver && <div></div>}
    </div>
  );
}
