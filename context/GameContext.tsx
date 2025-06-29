"use client";

import type {
  Topic,
  Mode,
  PublicDailyGame,
  Answer,
} from "@/proto/janus/plato/object_pb";
import { createContext, useContext, useState } from "react";

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
  return (
    <GameContext.Provider value={{ ...value, gameOver, setGameOver }}>
      {children}
    </GameContext.Provider>
  );
};
