"use client";

import type {
  Topic,
  Mode,
  PublicDailyGame,
  Answer,
} from "@/proto/janus/plato/object_pb";
import { createContext, useContext, useState, useEffect } from "react";
import { dailyGameClient } from "@/lib/janus/client/plato";
import { newJanusError } from "@/lib/janus/client/error";

type Props = {
  topic: Topic;
  modes: Mode[];
  currentMode: Mode;
  dailyGame: PublicDailyGame;
  answers: Answer[];
};

type GameContextType = Props & {
  gameOver: boolean;
  setGameOver: (v: boolean) => void;
  switchMode: (mode: Mode) => void;
  clearDataTrigger: number;
};

export const GameContext = createContext<GameContextType | null>(null);

export const useGame = (): GameContextType => {
  const game = useContext(GameContext);
  if (!game) throw new Error("usegame must be used within gameProvider");
  return game;
};

export const GameProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: Props;
}) => {
  const [gameOver, setGameOver] = useState(false);
  const [currentMode, setCurrentMode] = useState<Mode>(value.currentMode);
  const [currentDailyGame, setCurrentDailyGame] = useState<PublicDailyGame>(
    value.dailyGame,
  );
  const [clearDataTrigger, setClearDataTrigger] = useState(0);

  const clearGameData = () => {
    setClearDataTrigger((prev) => prev + 1);
  };

  const switchMode = (mode: Mode) => {
    // Clear game data immediately before switching
    clearGameData();

    setCurrentMode(mode);
    setGameOver(false); // Reset game over state when switching modes

    // Update URL without triggering a page reload
    if (typeof window !== "undefined") {
      const newUrl = `/g/${value.topic.slug}/${mode.title.toLowerCase()}`;
      window.history.pushState({}, "", newUrl);
    }
  };

  // Fetch daily game data when mode changes
  useEffect(() => {
    if (currentMode.id === value.currentMode.id) {
      // Use the initially fetched daily game for the current mode
      setCurrentDailyGame(value.dailyGame);
      return;
    }

    // Fetch daily game data for the new mode
    dailyGameClient
      .getPublicDailyGame({ modeId: currentMode.id })
      .then((resp) => {
        const dailyGame = resp.publicDailyGame;
        if (dailyGame) {
          setCurrentDailyGame(dailyGame);
        }
      })
      .catch((err) => {
        newJanusError(err).handle();
      });
  }, [currentMode, value.currentMode.id, value.dailyGame]);

  return (
    <GameContext.Provider
      value={{
        ...value,
        currentMode,
        dailyGame: currentDailyGame,
        gameOver,
        setGameOver,
        switchMode,
        clearDataTrigger,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
