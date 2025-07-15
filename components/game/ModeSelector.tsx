"use client";

import { useGame } from "@/context/GameContext";
import { Mode } from "@/proto/janus/plato/object_pb";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  readonly modes: Mode[];
};

export default function ModeSelector({ modes }: Props) {
  const { currentMode, switchMode } = useGame();

  return (
    <>
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => switchMode(mode)}
          className={`size-16 rounded-full overflow-hidden mb-3 border-2 transition-all duration-200 ${
            currentMode.id === mode.id
              ? "border-white/80 scale-110 shadow-lg"
              : "border-white/50 hover:brightness-75 hover:scale-105"
          }`}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Image
                src={mode.iconUrl || "/img/default-icon.png"}
                alt={mode.title}
                className="w-full h-full object-cover"
                loading="lazy"
                height={100}
                width={100}
              />
            </TooltipTrigger>

            <TooltipContent>
              <p>{mode.title}</p>
            </TooltipContent>
          </Tooltip>
        </button>
      ))}
    </>
  );
}
