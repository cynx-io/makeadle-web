"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/context/GameContext";

export default function TopicModesPage() {
  const { topic, currentMode: mode } = useGame();
  const router = useRouter();

  useEffect(() => {
    if (topic && mode) {
      router.replace(`/g/${topic.slug}/${mode.Type.toLowerCase()}`);
    }
  }, [topic, mode, router]);

  return null; // or a loading indicator
}
