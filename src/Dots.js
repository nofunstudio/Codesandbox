import { useFrame } from "@react-three/fiber";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";

// https://www.desmos.com/calculator/agt7tb1dky?lang=zh-CN

// eslint-disable-next-line react/prop-types
export default function Dots() {
  const roundedSquareWave = (t, delta, a, f) => {
    return (
      ((2 * a) / Math.PI) * Math.atan(Math.sin(2 * Math.PI * t * f) / delta)
    );
  };
  const ref = useRef();
  // vec to cache position to cal
  const { vec, transform, positions, distances } = useMemo(() => {
    const vec = new THREE.Vector3();
    const transform = new THREE.Matrix4();
    const positions = [...Array(10000)].map((_, i) => {
      const position = new THREE.Vector3();

      // in a grid
      position.x = (i % 100) - 50;
      position.y = Math.floor(i / 100) - 50;

      // hexagonal pattern 六边形
      //position.y += (i % 2) * 0.5;

      // Add noise 偏移
      //position.x += Math.random() * 0.3;
      // position.y += Math.random() * 0.3;
      return position;
    });
    // 平行x轴的向量
    // const right = new THREE.Vector3(1, 0, 0)
    // 每一个位置到(0,0,0)的长度的数组
    // https://www.desmos.com/calculator/4eiqbvjdzm?lang=zh-CN
    const distances = positions.map((pos) =>
      // 八边形 Octagon
      pos.length()
    );
    return { vec, transform, positions, distances };
  }, []);

  useFrame(({ clock }) => {
    var phase = 50;
    var roundness = 97;
    var frequency = 0.3;
    var amplitude = 0;
    for (let i = 0; i < 10000; ++i) {
      // Distance affects the wave phase

      const t = clock.elapsedTime - distances[i] / phase;
      // change Frequency Amplitude
      const wave = roundedSquareWave(t, roundness, amplitude, frequency);
      const scale = 1 + wave * 0.3;
      // 将该向量与所传入的标量scale进行相乘。
      vec.copy(positions[i]).multiplyScalar(scale);
      // 放到矩阵中 4*4
      transform.setPosition(vec);
      ref.current.setMatrixAt(i, transform);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[null, null, 10000]}>
      <circleGeometry args={[0.05]} />
      <meshBasicMaterial color="#00FFC2" />
    </instancedMesh>
  );
}
