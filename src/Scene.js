import {
  PerspectiveCamera,
  Stats,
  MeshReflectorMaterial,
  distortionTexture,
  Environment,
  Backdrop
} from "@react-three/drei";
import { RigidBody, Physics, Debug } from "@react-three/rapier";
import Ball from "./Ball";

import Pointer from "./Pointer";
import React, { useRef, useState, useEffect } from "react";

import Bricks from "./Bricks";

import Dots from "./Dots";

export default function Scene({ ...props }) {
  const myMesh0 = React.useRef();

  const [active0, setActive0] = useState(false);

  return (
    <>
      <color attach="background" args={["#050505"]} />
      <PerspectiveCamera
        name="Camera"
        makeDefault={true}
        far={100000}
        near={5}
        fov={45}
        position={[0, 20, 0]}
        rotation={[-0.47, 0.03, 0.02]}
      />

      <group {...props} dispose={null}>
        <Physics gravity={[0, -9.08, 0]}>
          <Bricks />

          <Ball position-y={0.2} position-z={2} />
          <Pointer />

          <mesh
            position-y={0.1}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={[0.09, 0.16, 1]}
          >
            <Dots />
          </mesh>

          <RigidBody type="fixed">
            <mesh
              name="FLOOR "
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, 0, 0]}
            >
              <planeGeometry args={[9.5, 16.0, 32, 32]} />
              <MeshReflectorMaterial
                blur={[250, 100]}
                resolution={1000}
                mixBlur={1}
                mixStrength={20}
                roughness={1}
                depthScale={5.2}
                minDepthThreshold={0.4}
                maxDepthThreshold={1.4}
                color="#050505"
                metalness={0.5}
              />
            </mesh>
          </RigidBody>

          <RigidBody
            type="fixed"
            colliders="cuboid"
            mass={1}
            restitution={0.0}
            friction={0}
            linearDamping={0.0}
            angularDamping={0}
          >
            <mesh position={[-4.8, 0, 0]} rotation={[0, Math.PI / 1.01, 0]}>
              <boxGeometry args={[0.5, 1, 16]} />
              <meshPhysicalMaterial
                color="#050505"
                roughness={0.0}
                envMapIntensity={0.5}
                emissive="#313131"
                metalness={0.5}
              />
            </mesh>
          </RigidBody>

          <RigidBody
            type="fixed"
            colliders="cuboid"
            mass={1}
            restitution={0.0}
            friction={0}
            linearDamping={0.0}
            angularDamping={0}
          >
            <mesh position={[4.8, 0, 0]} rotation={[0, -Math.PI / 1.01, 0]}>
              <boxGeometry args={[0.5, 1, 16]} />
              <meshPhysicalMaterial
                color="#050505"
                roughness={0.0}
                envMapIntensity={0.5}
                emissive="#313131"
                metalness={0.5}
              />
            </mesh>
          </RigidBody>

          <RigidBody
            type="fixed"
            colliders="cuboid"
            mass={1}
            restitution={0.0}
            friction={0}
            linearDamping={0.0}
            angularDamping={0}
          >
            <mesh position={[0, 0, -8]}>
              <boxGeometry args={[9.5, 1, 0.5]} />
              <meshPhysicalMaterial
                color="#050505"
                roughness={0.0}
                envMapIntensity={0.5}
                emissive="#313131"
                metalness={0.5}
              />
            </mesh>
          </RigidBody>

          <RigidBody
            type="fixed"
            colliders="cuboid"
            mass={1}
            restitution={0.0}
            friction={0}
            linearDamping={0.0}
            angularDamping={0}
          >
            <mesh position={[0, 0, 8]}>
              <boxGeometry args={[9.5, 1, 0.5]} />
              <meshPhysicalMaterial
                color="#050505"
                roughness={0.0}
                envMapIntensity={0.5}
                emissive="#313131"
                metalness={0.5}
              />
            </mesh>
          </RigidBody>

          <ambientLight />
          <directionalLight castShadow position={[0, 2, 0]} intensity={4} />
          <pointLight position={[10, 10, 10]} />
          <pointLight position={[-10, -10, -10]} intensity={5} />
        </Physics>

        <Stats />
      </group>
    </>
  );
}
