import {
  useKeyboardControls,
  MeshReflectorMaterial,
  Trail
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody, useRapier, interactionGroups } from "@react-three/rapier";
import { useCallback, useEffect, useRef, useState } from "react";
import { MeshPhysicalMaterial } from "three";
import { useGame } from "./useGame";
import { easing } from "maath";

export default function Ball(props) {
  const [hit1, notHit1] = useState(false);

  const { rapier, world } = useRapier();
  const gamePhase = useGame((state) => state.phase);
  const startGame = useGame((state) => state.start);
  const restartGame = useGame((state) => state.restart);
  const ballRef = useRef();
  const colorRef = useRef();
  const scaleRef = useRef();
  console.log(ballRef.mesh);

  const collisionEnter = () => {
    notHit1(true);
  };
  useEffect(() => {
    if (hit1) {
      const timer = setTimeout(() => {
        notHit1((current) => !current);
        console.log(hit1);
      }, 75);
      return () => clearTimeout(timer);
    }
  });

  const [subscribeKeys, getKeys] = useKeyboardControls();

  const jumpHandler = useCallback(() => {
    const rapierWorld = world.raw();

    const ballPosition = ballRef.current.translation();
    const groundDirection = { x: 0, y: -1, z: 0 };
    const ray = new rapier.Ray(ballPosition, groundDirection);
    const hit = rapierWorld.castRay(ray);
    console.log(hit);

    const isBallOnGround = hit?.toi < 1;

    if (isBallOnGround) {
      ballRef.current.applyImpulse({ x: 0, y: 1, z: 0 });
      console.log("ground");
    }
  }, [ballRef, rapier, world]);

  const resetHandler = useCallback(() => {
    ballRef.current.setTranslation({ x: 0, y: 0.001, z: 2 });
    ballRef.current.setLinvel({ x: 0, y: 0, z: 0 });
    ballRef.current.setAngvel({ x: 0, y: 0, z: 0 });
  }, [ballRef]);

  useEffect(() => {
    return subscribeKeys(
      ({ jump }) => ({ jump }),
      ({ jump }) => {
        if (jump) jumpHandler();
      }
    );
  }, [subscribeKeys, jumpHandler, restartGame]);

  useEffect(() => {
    return useGame.subscribe(
      (state) => state.phase,
      (phase) => {
        if (phase === "ready") resetHandler();
      }
    );
  }, [resetHandler]);

  useFrame((_, delta) => {
    //scale color on collision

    easing.dampC(
      colorRef.current.color,
      hit1 ? "#FFE86C" : "#FFB800",
      0.075,
      delta
    );

    //scale change on collision
    easing.damp3(
      scaleRef.current.scale,
      hit1 ? [1.25, 1.25, 1.25] : [1, 1, 1],
      0.075,
      delta
    );

    const { forward, backward, left, right, jump } = getKeys();

    if (gamePhase === "ready") {
      startGame();
    }

    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    const impulseStrength = 10 * delta;
    const torqueStrength = 10 * delta;

    if (forward) {
      impulse.z -= impulseStrength;
      torque.x -= torqueStrength;
    }
    if (backward) {
      impulse.z += impulseStrength;
      torque.x += torqueStrength;
    }
    if (left) {
      impulse.x -= impulseStrength;
      torque.z -= torqueStrength;
    }
    if (right) {
      impulse.x += impulseStrength;
      torque.z += torqueStrength;
      console.log(ballRef.current.handle);
    }

    ballRef.current.applyImpulse(impulse);
    ballRef.current.applyTorqueImpulse(torque);

    //console.log(ballRef.current.handle);
    //useBVH(ballRef);
  });

  return (
    <RigidBody
      collisionGroups={interactionGroups(1)}
      gravityScale={0}
      ref={ballRef}
      colliders="ball"
      onCollisionEnter={() => collisionEnter()}
      onIntersectionEnter={() => collisionEnter()}
      mass={1}
      restitution={2.0}
      friction={0}
      linearDamping={0.0}
      angularDamping={0}
      {...props}
    >
      <mesh ref={scaleRef}>
        <sphereGeometry args={[0.15, 20, 20]} />
        <meshPhysicalMaterial
          ref={colorRef}
          color="yellow"
          roughness={0.1}
          envMapIntensity={0.5}
          emissive="#ef2060"
          attach="material"
        />
      </mesh>
    </RigidBody>
  );
}
