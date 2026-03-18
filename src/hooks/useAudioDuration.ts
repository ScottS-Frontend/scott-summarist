import { useState, useEffect } from "react";

export function useAudioDuration(audioUrl: string | undefined): number | null {
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(Math.floor(audio.duration));
      }
    };

    const handleError = () => {
      console.error("Failed to load audio metadata");
      setDuration(null);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("error", handleError);
    audio.preload = "metadata";

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("error", handleError);
      audio.src = "";
    };
  }, [audioUrl]);

  return duration;
}
