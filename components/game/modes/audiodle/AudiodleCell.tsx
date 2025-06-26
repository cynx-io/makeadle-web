"use client";

import {
  TooltipContent,
  TooltipTrigger,
  Tooltip,
} from "@/components/ui/tooltip";
import { motion, Variants } from "motion/react";
import Image from "next/image";
import React from "react";

export type AudiodleCellProps = {
  iconUrl: string;
  isCorrect: boolean;
  cellSizeCss: string;
  tooltipValue?: string;
  custom?: number;
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

export const AudiodleCell = ({
  iconUrl,
  tooltipValue,
  isCorrect,
  cellSizeCss,
  custom, // Destructure the custom prop here
}: AudiodleCellProps) => {
  let bgColor = "bg-green-700";
  let opacity = 1;

  if (isCorrect) {
    bgColor = "bg-red-700";
    opacity = 0.4;
  }

  return (
    <motion.div
      variants={cellVariants}
      custom={custom}
      initial="hidden"
      animate={{ opacity: opacity, scale: 1 }}
      className={`text-center text-lg font-bold rounded-xs justify-center items-center cursor-default border-2 text-shadow-2xs ${cellSizeCss} ${bgColor} flex mx-auto`}
    >
      {tooltipValue ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full h-full flex flex-wrap justify-center items-center">
              <Image
                src={iconUrl}
                alt={tooltipValue}
                width={200}
                height={200}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-red-600 opacity-90 text-white">
            <p>{tooltipValue}</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <div className="w-full h-full flex flex-wrap justify-center items-center">
          <Image src={iconUrl} alt={""} width={200} height={200} />
        </div>
      )}
    </motion.div>
  );
};
