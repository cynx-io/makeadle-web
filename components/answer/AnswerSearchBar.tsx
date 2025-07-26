"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Command, CommandInput, CommandItem, CommandList } from "../ui/command";
import Image from "next/image";
import { Answer } from "@/proto/janus/plato/object_pb";
import { Separator } from "../ui/separator";

type Props = {
  onSelect: (answerId: number) => Promise<void>;
  answers: Answer[];
};

export default function AnswerSearchBar({
  onSelect,
  answers,
}: Readonly<Props>) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Answer[]>([]);

  useEffect(() => {
    const handler = async (q: string) => {
      if (!q) {
        setResults([]);
        return;
      }
      try {
        const filteredAnswers = answers.filter((answer) =>
          answer?.name.toLowerCase().includes(q.toLowerCase()),
        );
        setResults(filteredAnswers);
      } catch {
        setResults([]);
      }
    };

    handler(query);
  }, [query, answers]);

  const handleOnSelect = async (answerId: number) => {
    setQuery("");
    setResults([]);
    onSelect(answerId);
  };

  const showDropdown = results.length > 0;

  return (
    <div className="w-full relative bg-blue-100">
      <Command className="w-full bg-blue-100">
        <CommandInput
          value={query}
          onValueChange={(val) => {
            setQuery(val);
          }}
          placeholder="Type a Hero Name"
          className="text-lg h-96"
        />

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-1 bg-slate-100 top-full shadow-lg z-50 overflow-hidden absolute w-full "
            >
              <CommandList className=" hover:brightness-90">
                {results.map((ans) => {
                  if (!ans) return null;
                  const answer = ans;

                  return (
                    <CommandItem
                      key={answer.id}
                      value={answer.name}
                      onSelect={() => handleOnSelect(answer.id)}
                      className="flex items-center gap-2 my-2 cursor-pointer relative"
                    >
                      <Image
                        loader={({ src }) => src}
                        src={answer.iconUrl ?? "/img/invalid.png"}
                        alt={answer.name}
                        width={50}
                        height={50}
                        className="rounded-full"
                      />
                      <div>
                        <p className="text-xl font-medium text-gray-700">
                          {answer.name}
                        </p>
                      </div>
                      <Separator className="bg-gray-300 absolute bottom-0" />
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
