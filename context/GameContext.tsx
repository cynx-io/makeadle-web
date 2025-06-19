"use client";

import type {
  Topic,
  Mode,
  PublicDailyGame,
  DetailAnswer,
} from "@/proto/janus/plato/object_pb";
import { createContext, useContext } from "react";

type Props = {
  topic: Topic;
  modes: Mode[];
  currentMode: Mode;
  dailyGame: PublicDailyGame;
  answers: DetailAnswer[];
};

export const GameContext = createContext<Props | null>(null);

export const useGame = (): Props => {
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
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
