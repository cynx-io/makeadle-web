"use client";

import { useEffect, useState } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import { ethSearch, EthSearchResp } from "@/lib/janus/crypto/ethSearch";
import { debounce } from "lodash";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function EthSearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<EthSearchResp["coins"]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const handler = debounce(async (q: string) => {
      if (!q) {
        setLoading(false);
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const { coins } = await ethSearch(q);
        setResults(coins);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
        setSearching(false);
      }
    }, 300);

    handler(query);
    return () => handler.cancel();
  }, [query]);

  const onSelect = (id: string) => {
    router.push(`/risk/${id}`);
  };

  const showDropdown = !searching && (loading || results.length > 0);

  return (
    <div className="w-full">
      <Command className="w-full">
        <CommandInput
          value={query}
          onValueChange={(val) => {
            setQuery(val);
            setSearching(true);
            setResults([]);
          }}
          placeholder="Search for a coin..."
          className="text-sm"
        />

        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-1 bg-white rounded-lg shadow-lg z-50 overflow-hidden"
            >
              <CommandList>
                {loading && (
                  <CommandItem disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-muted-foreground" />
                    Searching coins...
                  </CommandItem>
                )}

                {!loading &&
                  results.map((coin) => (
                    <CommandItem
                      key={coin.id}
                      value={coin.name}
                      onSelect={() => onSelect(coin.id)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Image
                        src={coin.thumb}
                        alt={coin.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium">{coin.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {coin.symbol.toUpperCase()}
                        </p>
                      </div>
                    </CommandItem>
                  ))}

                {!loading && query && results.length === 0 && (
                  <CommandItem disabled>No coins found</CommandItem>
                )}
              </CommandList>
            </motion.div>
          )}
        </AnimatePresence>
      </Command>
    </div>
  );
}
