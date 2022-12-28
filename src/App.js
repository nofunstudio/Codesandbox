import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Scene from "./Scene";
import CameraPos from "./Camera";
import { KernelSize } from "postprocessing";

import { Interface } from "./Interface";
import { NavigationControls } from "./NavigationControls";
import { ShortcutManager } from "./ShortcutManager";
import {
  EffectComposer,
  ChromaticAberration,
  SSAO,
  Bloom
} from "@react-three/postprocessing";

function App() {
  return (
    <NavigationControls>
      <Suspense fallback={null}>
        <Canvas
          shadows
          flat
          linear
          camera={{ position: [0, 0, 15], near: 10, far: 80 }}
        >
          <EffectComposer></EffectComposer>
          <OrbitControls enabled={true} />

          <Scene />
        </Canvas>
      </Suspense>
      <Interface />
      <ShortcutManager />
    </NavigationControls>
  );
}
export default App;
