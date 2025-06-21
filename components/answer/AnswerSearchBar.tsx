"use client";

import { debounce } from "lodash";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Command, CommandInput, CommandItem, CommandList } from "../ui/command";
import Image from "next/image";
import { Answer, DetailAnswer } from "@/proto/janus/plato/object_pb";

type Props = {
  onSelect: (answerId: number) => void;
  answers: DetailAnswer[];
};

export default function AnswerSearchBar({ onSelect, answers }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DetailAnswer[]>([]);

  useEffect(() => {
    const handler = async (q: string) => {
      if (!q) {
        setResults([]);
        return;
      }
      try {
        const filteredAnswers = answers.filter((answer) =>
          answer.answer?.name.toLowerCase().includes(q.toLowerCase()),
        );
        setResults(filteredAnswers);
      } catch {
        setResults([]);
      }
    };

    handler(query);
  }, [query]);

  const handleOnSelect = (answerId: number) => {
    setQuery("")
    setResults([])
    onSelect(answerId)
  }

  const showDropdown = results.length > 0;

  return (
    <div className="w-full relative">
      <Command className="w-full">
        <CommandInput
          value={query}
          onValueChange={(val) => {
            setQuery(val);
          }}
          placeholder="Search for a answer..."
          className="text-sm"
        />

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-1 bg-white rounded-lg top-full shadow-lg z-50 overflow-hidden absolute w-full"
            >
              <CommandList>
                {results.map((detailAnswer) => {
                  if (!detailAnswer.answer) return null;
                  const answer = detailAnswer.answer;

                  return (
                    <CommandItem
                      key={answer.id}
                      value={answer.name}
                      onSelect={() => handleOnSelect(answer.id)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Image
                        src={answer.iconUrl ?? "/img/invalid.png"}
                        alt={answer.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium">{answer.name}</p>
                      </div>
                    </CommandItem>
                  );
                })}

                {query && results.length === 0 && (
                  <CommandItem disabled>No answers found</CommandItem>
                )}
              </CommandList>
            </motion.div>
          )}
        </AnimatePresence>
      </Command>
    </div>
  );
}
