"use client";

import { useRef } from "react";

export default function AudioPlayer({ audioUrl }: { audioUrl: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.volume = 1;
      audioRef.current.muted = false;
      audioRef.current
        .play()
        .then(() => {
          console.log("Audio playing:", audioUrl);
        })
        .catch((err) => {
          console.error("Playback failed:", err);
        });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handlePlay}
        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        ▶️ Play
      </button>
      <audio ref={audioRef} preload="auto">
        <source src={audioUrl} type="audio/ogg" />
        <source src={audioUrl.replace(".ogg", ".mp3")} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
