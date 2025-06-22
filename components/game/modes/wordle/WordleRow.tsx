// components/game/WordleRow.tsx
"use client";

import React from "react";
import { motion } from "motion/react";
import { CorrectnessType } from "@/types/game/correctnessType";
import { WordleCell, WordleCellProps } from "./WordleCell"; // Import WordleCell and its props type
import Image from "next/image"; // For the answer icon
import {
  AttemptDetailAnswer,
  DetailAnswer,
} from "@/proto/janus/plato/object_pb"; // Adjust path as needed
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // For the answer icon tooltip
import { AttemptAnswerResponse } from "@/proto/janus/plato/dailygame_pb";

export type WordleRowProps = {
  attemptAnswer: AttemptAnswerResponse; // The full answer object for the row
  categories: string[]; // List of category names
  cellSizeCss: string;
  // You might want to pass the `getCorrectnessType` function as a prop if it's external,
  // or re-implement logic here if it makes sense. For now, assuming access.
  getCorrectnessType: (
    categoryType: string,
    correctnessValue: number,
  ) => CorrectnessType;
};

// Variants for the row container (to orchestrate stagger)
const rowContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      //   delayChildren: 0, // Optional: slight delay before the first cell animates
      staggerChildren: 20, // Each cell animates 0.08 seconds after the previous
    },
  },
};

// No need for separate item variants if WordleCell directly uses its own.
// The stagger is managed by `rowContainerVariants` and `custom` prop in `WordleCell`.

export const WordleRow = ({
  attemptAnswer,
  categories,
  cellSizeCss,
  getCorrectnessType,
}: WordleRowProps) => {
  const detailAnswer = attemptAnswer.attemptDetailAnswer;
  if (!detailAnswer) return <div>Error no Detail Answer</div>;

  const answer = detailAnswer.answer;
  if (!answer) return <div>Error No Answer</div>;

  return (
    <motion.div
      className="contents" // Use "contents" to avoid creating an extra div that breaks grid layout
      variants={rowContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Answer Icon Cell (first column) */}
      <div className={`flex w-full ${cellSizeCss}`}>
        <Tooltip>
          <TooltipTrigger>
            <Image
              src={answer.iconUrl ?? "/img/invalid.png"}
              alt={answer.name}
              width={100}
              height={100}
              className="object-contain border-2"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>{answer.name}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Category Cells (remaining columns) */}
      {categories.map((category, index) => {
        const matchedCategories =
          detailAnswer.answerCategories?.filter((c) => c.name === category) ??
          [];

        let cellType: CorrectnessType = CorrectnessType.UNKNOWN;
        let cellValue: string = "x";

        if (matchedCategories.length > 0) {
          const categoryType = matchedCategories[0]?.type ?? "string"; // Assuming type is consistent per category name
          const maxCorrectness = Math.max(
            ...matchedCategories.map((c) => c.correctness),
          );
          cellType = getCorrectnessType(categoryType, maxCorrectness);
          cellValue = matchedCategories.map((c) => c.value).join(", ");
        }

        return (
          <WordleCell
            key={`${answer.id}-${category}`} // Unique key for each cell
            category={category}
            cellSizeCss={cellSizeCss}
            type={cellType}
            value={cellValue}
            // The `custom` prop is passed down and used by cellVariants to determine individual delay
            custom={index * 0.08} // This creates the stagger effect (index * stagger_amount)
          />
        );
      })}
    </motion.div>
  );
};
