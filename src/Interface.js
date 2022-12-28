import { addEffect } from "@react-three/fiber";
import { useEffect, useRef } from "react";

import { useGame } from "./useGame";

function Interface() {
  const timerRef = useRef();

  const highScore = useGame((state) => state.highScore);
  const gamePhase = useGame((state) => state.phase);
  const startGame = useGame((state) => state.start);
  const restartGame = useGame((state) => state.restart);

  //const controls = useKeyboardControls((state) => state);

  useEffect(() => {
    return addEffect(() => {
      const state = useGame.getState();

      let elapsedTime = 0;

      if (state.phase === "playing") {
        elapsedTime = Date.now() - state.startTime;
      } else if (state.phase === "ended") {
        elapsedTime = state.endTime - state.startTime;
      }

      elapsedTime /= 1000;
      elapsedTime = elapsedTime.toFixed(2);

      if (timerRef.current) timerRef.current.innerText = elapsedTime;
    });
  }, []);

  function handleToggleAudio(e) {
    e.target.blur();
  }

  return (
    <div className="interface">
      {highScore > 0 && (
        <div className="high-score">
          <h2>High Score: {(highScore / 1000).toFixed(2)}</h2>
        </div>
      )}

      <button className="audio-toggle" onClick={handleToggleAudio}></button>

      <h2 ref={timerRef} className="time">
        0.00
      </h2>

      {gamePhase === "ready" && (
        <h2 className="cta" onClick={startGame}>
          Play
        </h2>
      )}

      {gamePhase === "ended" && (
        <h2 className="cta" onClick={restartGame}>
          Restart
        </h2>
      )}

      <div className="controls"></div>

      <div className="misc-controls">
        <div className="misc-control">
          <div className="key">R</div>
          <div className="label">Reset</div>
        </div>
        <div className="misc-control">
          <div className="key">M</div>
          <div className="label">Mute/Unmute</div>
        </div>
      </div>
    </div>
  );
}

export { Interface };
