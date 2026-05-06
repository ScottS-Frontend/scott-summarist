import { useState, useEffect } from "react";

export function useAudioDuration(audioUrl: string | undefined): number | null {
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    if (!audioUrl) {
      setDuration(null);
      return;
    }

    const audio = new Audio(audioUrl);

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && audio.duration !== Infinity) {
        setDuration(Math.floor(audio.duration));
      }
    };

    const handleError = () => {
      console.error("Failed to load audio metadata for:", audioUrl);
      setDuration(null);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("error", handleError);

    // Force the browser to load metadata
    audio.preload = "metadata";
    audio.load();

    // Handle case where metadata is already available (cached)
    if (audio.readyState >= 1 && audio.duration && !isNaN(audio.duration)) {
      setDuration(Math.floor(audio.duration));
    }

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("error", handleError);
      audio.src = "";
      audio.load(); // Forces cleanup
    };
  }, [audioUrl]);

  return duration;
}