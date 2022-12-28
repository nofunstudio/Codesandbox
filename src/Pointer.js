import * as THREE from "three";
import { DoubleSide } from "three";
import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Capsule, MeshReflectorMaterial, useTexture } from "@react-three/drei";
import { RigidBody, useRapier, interactionGroups } from "@react-three/rapier";
import { a, config } from "@react-spring/three";
import { useSpring } from "@react-spring/core";

import { easing } from "maath";
import { MeshStandardMaterial } from "three";

var BounceP = [0, 0.2, 4.5];
var bZ = 0;
var bY = 0.2;

//var BouncePOffset = [0, 0.2, 4.5];

//var BouncePOffset = { x: 0, y: 0.2, z: 4.5 };
var collisionP = 0;
var scale = [1, 1, 1];

export default function Pointer({ vec = new THREE.Vector3() }) {
  const [hit, notHit] = useState(false);
  const [hit1, notHit1] = useState(false);
  const { world } = useRapier();
  const texture = useTexture("/circle2.png");

  const collisionEnter = () => {
    notHit(true);
  };

  const PlaneHolder = new THREE.PlaneGeometry();
  const Matt = new MeshStandardMaterial();
  Matt.transparent = true;
  Matt.opacity = 0.0;
  const ref = useRef();
  const planeRef = useRef();
  const colorRef = useRef();
  const scaleRef = useRef();
  bZ = BounceP.z + 0.05;

  useEffect(() => {
    //ref.current.setNextKinematicTranslation(BounceP);

    const hitter = world.getRigidBody("1.33e-322");
    //RIGID BODY REMOVED CAUSES ERROR
    //const ballPoss = hitter.translation();
    //console.log("ballPs", ballPoss);

    const impulse = { x: 0, y: 0, z: 0 };
    var torque = { x: 0, y: 0, z: 0 };
    var vel = { x: 0, y: 0, z: 0 };
    var velX = 0;
    var velY = 0;
    var normalizedCollisonP = collisionP + 200;
    var normalizedBounceP = BounceP.x + 150;
    var normalizedSummary = normalizedCollisonP - normalizedBounceP - 50;
    //const bX = BounceP.x;
    //const bY = BounceP.y;
    //const bZ = BounceP.z + 0.05;
    //BouncePOffset = { x: BounceP.x, y: BounceP.y, z: BounceP.z + 0.05 };
    //BouncePOffset.x = bX;
    //BouncePOffset.y = bY;
    //BouncePOffset.z = bZ;

    const impulseStrength = 5 * 2;
    //const torqueStrength = 10 * 2;
    if (hit) {
      //velX = hitter.linvel().x;

      velY = 0;
      console.log("ball ", normalizedCollisonP);
      console.log("paddle ", normalizedBounceP);
      console.log(normalizedSummary);
      vel = { x: velX, y: velY, z: 0 };

      hitter.setLinvel(vel);
      console.log(hitter);

      impulse.z -= impulseStrength;
      impulse.x += normalizedSummary * 4;
      //torque.x += normalizedSummary * 1000;
      hitter.applyImpulse(impulse);

      //hitter.applyTorqueImpulse(torque);
      notHit(false);
      notHit1(true);

      //impulse = { x: 0, y: 0, z: 0 };
      //torque = { x: 0, y: 0, z: 0 };
    }
  });

  //collision color timeout
  useEffect(() => {
    if (hit1) {
      const timer = setTimeout(() => {
        notHit1((current) => !current);
        console.log(hit1);
      }, 75);
      return () => clearTimeout(timer);
    }
  });

  useFrame((vec, delta) => {
    //color change on collision

    var BouncePOffset = BounceP;
    BouncePOffset.z = bZ;

    easing.dampC(
      colorRef.current.material.color,
      hit1 ? "#8F00FF" : "#FF008A",
      0.075,
      delta
    );
    //scale change on collision
    easing.damp3(
      scaleRef.current.scale,
      hit1 ? [1.2, 1.2, 1.2] : [1, 1, 1],
      0.075,
      delta
    );
    easing.damp3(
      vec,
      //[(mouse.x * viewport.width) / 2, 2, (mouse.y * viewport.height) / -2],
      BounceP,

      0.005,
      delta,
      Infinity
    );
    //console.log(BouncePOffset);
    ref.current.setNextKinematicTranslation(vec);
    planeRef.current.setNextKinematicTranslation(vec);
  });
  return (
    <group>
      <mesh
        onPointerMove={(e) => {
          bZ = e.point.z - 0.8;
          BounceP = new THREE.Vector3(e.point.x, bY, bZ);
        }}
        onPointerDown={(e) => console.log(BounceP)}
        name="Floor"
        geometry={PlaneHolder}
        material={Matt}
        castShadow
        receiveShadow
        position={[0, 0.0, 4]}
        rotation-x={-Math.PI / 2}
        scale={[8.5, 7, 0.1]}
      ></mesh>

      <RigidBody type="kinematicPosition" ref={planeRef}>
        <mesh position={[0, -0.18, 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.5, 0.5]} />
          <meshBasicMaterial
            map={texture}
            transparent={true}
            side={DoubleSide}
            opacity={0.7}
          />
        </mesh>
      </RigidBody>

      <RigidBody
        type="kinematicPosition"
        onIntersectionEnter={(collisionTarget) => {
          collisionP = collisionTarget.rigidBodyObject.position.x;
          console.log(collisionP);
          collisionEnter();
        }}
        colliders="cuboid"
        sensor
        position={[0, 0, 0]}
        mass={10}
        friction={0}
        restitution={0.0}
        ref={ref}
      >
        <mesh ref={scaleRef}>
          <Capsule
            ref={colorRef}
            onClick={() => notHit1((current) => !current)}
            receiveShadow
            castShadow
            args={[0.2, 1.3, 30, 10]}
            rotation={[Math.PI / 2, 0, Math.PI / 2]}
          >
            <meshPhysicalMaterial
              ref={colorRef}
              color="green"
              roughness={0.1}
              envMapIntensity={0.5}
              emissive="#ef2060"
            />
          </Capsule>
        </mesh>
      </RigidBody>
    </group>
  );
}
