// components/game/WordleCell.tsx
"use client";

import {
  TooltipContent,
  TooltipTrigger,
  Tooltip,
} from "@/components/ui/tooltip";
import { CorrectnessType } from "@/types/game/correctnessType";
import { motion, Variants } from "motion/react";
import React from "react";

export type WordleCellProps = {
  value: string;
  category: string;
  type: CorrectnessType;
  cellSizeCss: string;
  // ADD THIS LINE: Make 'custom' an optional number prop
  custom?: number; // Framer Motion uses 'custom' to pass data to variants functions
};

// Define variants for the individual cell's animation
const cellVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (custom: number = 0) => ({
    // Ensure custom has a default value for safety
    opacity: 1,
    scale: 1,
    transition: {
      delay: custom, // Apply delay here from the custom prop
      duration: 0.4, // Adjusted for quicker individual cell animation
      type: "spring",
      bounce: 0.6,
    },
  }),
};

export const WordleCell = ({
  category,
  value,
  type,
  cellSizeCss,
  custom, // Destructure the custom prop here
}: WordleCellProps) => {
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
      opacity = 0.4;
      break;
    case CorrectnessType.PARTIAL:
      bgColor = "bg-yellow-700";
      break;
    case CorrectnessType.CORRECT:
      bgColor = "bg-green-700";
      break;
    case CorrectnessType.NONE:
      tooltipValue = "Today's Answer don't have this value";
      bgColor = "bg-gray-700";
      break;
    case CorrectnessType.HIGHER:
      bgColor = "bg-yellow-700";
      break;
    case CorrectnessType.LOWER:
      bgColor = "bg-blue-700";
      break;
  }

  return (
    // Pass the custom prop to motion.div
    <motion.div
      variants={cellVariants}
      custom={custom} // Pass the custom prop received by WordleCell
      initial="hidden" // Add initial and animate back here for individual cell animation
      animate={{ opacity: opacity, scale: 1 }} // This ensures each cell animates when it enters the DOM
      className={`text-center text-lg font-bold rounded-xs justify-center items-center cursor-default border-2 text-shadow-2xs ${cellSizeCss} ${bgColor} flex mx-auto`}
    >
      {tooltipValue.length > 0 ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full h-full flex flex-wrap justify-center items-center">
              {value.split(", ").map((part, idx) => (
                <React.Fragment key={idx}>
                  {part}
                  {idx < value.split(", ").length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-red-600 opacity-90 text-white">
            <p>{tooltipValue}</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <div className="w-full h-full flex flex-wrap justify-center items-center">
          {value.split(", ").map((part, idx) => (
            <React.Fragment key={idx}>
              {part}
              {idx < value.split(", ").length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      )}
    </motion.div>
  );
};
