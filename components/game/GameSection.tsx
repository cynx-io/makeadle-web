"use client";

import { useGame } from "@/context/GameContext";
import { WordleGame } from "./modes/wordle/WordleGame";
import { useEffect, useRef, useState } from "react";
import { AttemptDetailAnswer, Clue, Mode } from "@/proto/janus/plato/object_pb";
import { dailyGameClient } from "@/lib/janus/client/plato";
import { newJanusError } from "@/lib/janus/client/error";
import { AudiodleGame } from "./modes/audiodle/AudiodleGame";
import { LoaderCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export function GameSection() {
  const { currentMode, dailyGame, modes, gameOver, setGameOver, topic } =
    useGame();

  const [attempts, setAttempts] = useState<AttemptDetailAnswer[]>([]);
  const [clues, setClues] = useState<Clue[]>([]);
  const [historyInitialized, setHistoryInitialized] = useState(false);
  const [nextMode, setNextMode] = useState<Mode | null>(null);

  const nextModeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!gameOver) return;

    const currentModeIndex = modes.findIndex((m) => m.id == currentMode.id);
    if (currentModeIndex < 0 || currentModeIndex >= modes.length - 1) {
      setNextMode(null);
      return;
    }

    const nextModeIndex = currentModeIndex + 1;
    setNextMode(modes[nextModeIndex]);

    // Auto-scroll to next mode card after a short delay
    setTimeout(() => {
      nextModeRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  }, [gameOver]);

  useEffect(() => {
    setHistoryInitialized(false);
    dailyGameClient
      .attemptHistory({
        dailyGameId: dailyGame.dailyGameId,
      })
      .then((resp) => {
        setAttempts(resp.attemptDetailAnswers.toReversed());
        setClues(resp.clues);

        if (resp.attemptDetailAnswers.some((a) => a.isCorrect)) {
          setGameOver(true);
        }
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
        <div className="text-center text-5xl font-extrabold">
          <LoaderCircle className="mx-auto w-16 h-16 animate-spin" />
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

      {gameOver && nextMode && (
        <div
          ref={nextModeRef}
          className="flex justify-center mt-10 scroll-m-40"
        >
          <Link href={`/g/${topic.slug}/${nextMode.title.toLowerCase()}`}>
            <Card className="w-[300px] bg-slate-100/10 hover:brightness-125 text-white font-extrabold text-xl hover:scale-105 transition-transform shadow-xl border-2 cursor-pointer">
              <CardHeader>
                <CardTitle className="text-center">
                  Next Mode: {nextMode.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center items-center">
                <img
                  src={nextMode.iconUrl || "/img/default-icon.png"}
                  alt={nextMode.title}
                  className="w-20 h-20 rounded-md object-cover"
                />
              </CardContent>
            </Card>
          </Link>
        </div>
      )}
    </div>
  );
}
