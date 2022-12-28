import * as THREE from "three";
import { useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useCursor } from "@react-three/drei";

function CameraPos() {
  const [active, setActive] = useState(false);
  const [zoom, set] = useState(false);
  const [vec] = useState(() => new THREE.Vector3());
  const [vec2] = useState(() => new THREE.Vector3());

  useEffect(() => {
    const timer = setTimeout(() => {
      set(true);
      console.log(active);
    }, 6000);
    return () => clearTimeout(timer);
  }, [active]);
  return useFrame((state) => {
    state.camera.position.lerp(
      vec.set(state.mouse.x * 40, state.mouse.y * 30 + 3, 500),
      0.05
    );
    state.camera.fov = THREE.MathUtils.lerp(
      state.camera.fov,
      zoom ? 1.1 : 0.9,
      0.045
    );
    state.camera.position.lerp(
      vec2.set(zoom ? 100 : 200, zoom ? 200 : 200, zoom ? 1 : 5.0),
      0.045
    );
    state.camera.lookAt(0, 0, 0);
    state.camera.updateProjectionMatrix();
  });
}
export default CameraPos;
