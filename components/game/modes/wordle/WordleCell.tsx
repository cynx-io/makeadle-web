// components/game/WordleCell.tsx
"use client";

import {
  TooltipContent,
  TooltipTrigger,
  Tooltip,
} from "@/components/ui/tooltip";
import { CorrectnessType } from "@/types/game/correctnessType";
import { motion, Variants } from "motion/react";
import { ArrowUp, ArrowDown } from "lucide-react";
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
  // Check if we're switching modes within the same topic
  const shouldAnimate = React.useMemo(() => {
    if (typeof window === "undefined") return true;

    const currentPath = window.location.pathname;
    const lastPath = sessionStorage.getItem("lastGamePath");

    // Extract topic slug from path (e.g., /g/pokemon/wordle -> pokemon)
    const currentTopic = currentPath.split("/")[2];
    const lastTopic = lastPath?.split("/")[2];

    // If switching within same topic, don't animate
    if (lastTopic && currentTopic === lastTopic) {
      return false;
    }

    // Store current path for next navigation
    sessionStorage.setItem("lastGamePath", currentPath);
    return true;
  }, []);
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
      bgColor = "bg-yellow-700";
      break;
  }

  const isContentTooLong = (content: string) => {
    // Consider content too long if it has more than 15 characters or multiple comma-separated values
    return content.length > 15 || content.includes(", ");
  };

  const renderCellContent = () => {
    const valueParts = value.split(", ");
    const shouldShowTooltip = isContentTooLong(value);

    const content = (() => {
      if (type === CorrectnessType.HIGHER) {
        return (
          <div className="w-full h-full flex flex-col justify-center items-center p-1 overflow-hidden">
            <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4 mb-1 text-white flex-shrink-0" />
            <div className="flex flex-wrap justify-center items-center text-center">
              <span className="leading-tight break-words hyphens-auto">
                {valueParts.map((part, idx) => (
                  <React.Fragment key={`higher-${idx}`}>
                    {part}
                    {idx < valueParts.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </span>
            </div>
          </div>
        );
      }

      if (type === CorrectnessType.LOWER) {
        return (
          <div className="w-full h-full flex flex-col justify-center items-center p-1 overflow-hidden">
            <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4 mb-1 text-white flex-shrink-0" />
            <div className="flex flex-wrap justify-center items-center text-center">
              <span className="leading-tight break-words hyphens-auto">
                {valueParts.map((part, idx) => (
                  <React.Fragment key={`lower-${idx}`}>
                    {part}
                    {idx < valueParts.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </span>
            </div>
          </div>
        );
      }

      // Default content for other types
      return (
        <div className="w-full h-full flex flex-wrap justify-center items-center p-1 text-center overflow-hidden">
          <span className="leading-tight break-words hyphens-auto">
            {valueParts.map((part, idx) => (
              <React.Fragment key={`default-${idx}`}>
                {part}
                {idx < valueParts.length - 1 && <br />}
              </React.Fragment>
            ))}
          </span>
        </div>
      );
    })();

    if (shouldShowTooltip && tooltipValue.length === 0) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full h-full cursor-help">{content}</div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p>{value}</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return content;
  };

  return (
    // Pass the custom prop to motion.div
    <motion.div
      variants={cellVariants}
      custom={custom} // Pass the custom prop received by WordleCell
      initial={shouldAnimate ? "hidden" : "visible"} // Only animate if switching topics
      animate={{ opacity: opacity, scale: 1 }} // This ensures each cell animates when it enters the DOM
      className={`text-center text-xs sm:text-sm md:text-base font-bold rounded-xs justify-center items-center cursor-default border-2 text-shadow-2xs ${cellSizeCss} ${bgColor} flex mx-auto aspect-square max-w-24 max-h-24 min-w-12 min-h-12`}
    >
      {tooltipValue.length > 0 ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full h-full">{renderCellContent()}</div>
          </TooltipTrigger>
          <TooltipContent className="bg-red-600 opacity-90 text-white">
            <p>{tooltipValue}</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        renderCellContent()
      )}
    </motion.div>
  );
};
