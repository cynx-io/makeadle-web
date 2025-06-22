"use client";

import {
  TooltipContent,
  TooltipTrigger,
  Tooltip,
} from "@/components/ui/tooltip";
import { CorrectnessType } from "@/types/game/correctnessType";
import { AnimatePresence, motion } from "motion/react";

export type Props = {
  value: string;
  category: string;
  type: CorrectnessType;
  cellSizeCss: string;
};

export const CategorySquare = ({
  category,
  value,
  type,
  cellSizeCss,
}: Props) => {
  let tooltipValue = "";
  let bgColor = "";
  let opacity = 1;

  switch (type) {
    case CorrectnessType.UNKNOWN:
      tooltipValue = "Not set by Owner";
      bgColor = "bg-gray-900";
      opacity = 0.2;
      break;
    case CorrectnessType.WRONG:
      bgColor = "bg-red-700";
      break;
    case CorrectnessType.PARTIAL:
      bgColor = "bg-yellow-900";
      break;
    case CorrectnessType.CORRECT:
      bgColor = "bg-green-700";
      break;
    case CorrectnessType.NONE:
      tooltipValue = "Today's Answer don't have this value";
      bgColor = "bg-gray-700";
      break;
    case CorrectnessType.HIGHER:
      bgColor = "bg-yellow-900";
      break;
    case CorrectnessType.LOWER:
      bgColor = "bg-blue-900";
      break;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: opacity, scale: 1 }}
      transition={{
        duration: 0.8,
        type: "spring",
        bounce: 0.6,
      }}
      className={`text-center text-lg font-bold rounded-xs justify-center items-center cursor-default border-2 text-shadow-2xs ${cellSizeCss} ${bgColor} flex mx-auto`}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full h-full flex justify-center items-center">
            {value}
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-red-600 opacity-90 text-white">
          <p>{tooltipValue}</p>
        </TooltipContent>
      </Tooltip>
    </motion.div>
  );
};
