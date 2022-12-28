import { useEffect, useMemo } from "react";
import { useAudio } from "./useAudio";
import { useGame } from "./useGame";

function SoundManager() {
  const audio = useAudio((state) => state.audio);
  const gamePhase = useGame((state) => state.phase);

  const successSound = useMemo(() => {
    const sound = new Audio("/sounds/success.mp3");
    sound.volume = 0.2;
    return sound;
  }, []);
  const backgroundSound = useMemo(() => {
    const sound = new Audio("/sounds/background.mp3");
    sound.loop = true;
    return sound;
  }, []);

  useEffect(() => {
    if (gamePhase === "ready") {
      //backgroundSound.volume = 0.05;
    }
    if (gamePhase === "playing") {
    }
    if (gamePhase === "ended") {
      //backgroundSound.volume = 0.2;
      //successSound.currentTime = 0;
      //successSound.play();
    }
  }, [gamePhase]);

  return null;
}

export { SoundManager };
