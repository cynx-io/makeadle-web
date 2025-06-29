"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Pause, Play } from "lucide-react";

interface AudioPlayerProps {
  audioUrl: string;
}

export default function AudioPlayer({ audioUrl }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const setAudioDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", setAudioDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", setAudioDuration);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.volume = 1;
      audio.muted = false;
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(console.error);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex items-center gap-3 w-full max-w-xl">
      <Button onClick={togglePlay} variant="ghost" size="icon">
        {isPlaying ? (
          <Pause className="w-5 h-5" />
        ) : (
          <Play className="w-5 h-5" />
        )}
      </Button>

      <Slider
        value={[currentTime]}
        onValueChange={handleSeek}
        max={duration || 100}
        step={0.1}
        className="flex-1"
      />

      <div className="text-xs text-muted-foreground min-w-[60px] text-right">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>

      <audio ref={audioRef} preload="auto">
        <source src={audioUrl} type="audio/ogg" />
        <source src={audioUrl.replace(".ogg", ".mp3")} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
