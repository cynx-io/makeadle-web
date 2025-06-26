"use client";

import { useGame } from "@/context/GameContext";
import { WordleGame } from "./modes/wordle/WordleGame";
import { useEffect, useState } from "react";
import { AttemptDetailAnswer, Clue } from "@/proto/janus/plato/object_pb";
import { dailyGameClient } from "@/lib/janus/client/plato";
import { newJanusError } from "@/lib/janus/client/error";
import { AudiodleGame } from "./modes/audiodle/AudiodleGame";
import { LoaderCircle } from "lucide-react";

export function GameSection() {
  const { currentMode, dailyGame } = useGame();
  const [isGameOver, setIsGameOver] = useState(false);
  const [attempts, setAttempts] = useState<AttemptDetailAnswer[]>([]);
  const [clues, setClues] = useState<Clue[]>([]);
  const [historyInitialized, setHistoryInitialized] = useState(false);

  useEffect(() => {
    setHistoryInitialized(false);
    dailyGameClient
      .attemptHistory({
        dailyGameId: dailyGame.dailyGameId,
      })
      .then((resp) => {
        setAttempts(resp.attemptDetailAnswers.toReversed());
        setClues(resp.clues);
      })
      .catch((err) => {
        newJanusError(err).handle();
      })
      .finally(() => {
        setHistoryInitialized(true);
      });
  }, [dailyGame]);


  if (!historyInitialized)
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2">
        <div className="animate-spin text-center text-5xl font-extrabold">
          <LoaderCircle className="mx-auto" />
          Loading History
        </div>
      </div>
    );

  return (
    <div>
      {(() => {
        switch (currentMode.Type) {
          case "WORDLE":
            return <WordleGame attempts={attempts} setAttempts={setAttempts} />;
          case "AUDIODLE":
            return (
              <AudiodleGame
                attempts={attempts}
                setAttempts={setAttempts}
                clues={clues}
                setClues={setClues}
              />
            );

          default:
            return <div>Unsupported game mode: {currentMode.Type}</div>;
        }
      })()}

      {isGameOver && <div></div>}
    </div>
  );
}
