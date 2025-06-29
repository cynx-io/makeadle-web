"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import React from "react";

export type AudiodleCellProps = {
  iconUrl: string;
  isCorrect: boolean;
  cellSizeCss: string;
  tooltipValue?: string;
  custom?: number;
};

const cellVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: custom,
      duration: 0.4,
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
  custom,
}: AudiodleCellProps) => {
  const bgColor = isCorrect ? "bg-green-700" : "bg-red-500";
  const imageFilter = isCorrect
    ? ""
    : "filter grayscale opacity-80 hover:opacity-100 hover:grayscale-0";

  return (
    <motion.div
      variants={cellVariants}
      custom={custom}
      initial="hidden"
      animate="visible"
      className={`text-center text-lg font-bold rounded-xs justify-center items-center cursor-default border-2 text-shadow-2xs ${cellSizeCss} ${bgColor} flex`}
    >
      {tooltipValue ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full h-full flex justify-center items-center">
              <Image
                src={iconUrl}
                alt={tooltipValue}
                width={200}
                height={200}
                className={`transition duration-300 ease-in-out ${imageFilter}`}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent className="opacity-95 shadow-lg">
            <p>{tooltipValue}</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <Image
            src={iconUrl}
            alt=""
            width={200}
            height={200}
            className={`transition duration-300 ease-in-out ${imageFilter}`}
          />
        </div>
      )}
    </motion.div>
  );
};
