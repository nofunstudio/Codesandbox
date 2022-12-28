import { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture, RoundedBox } from "@react-three/drei";
import { easing } from "maath";
import { RigidBody, interactionGroups, useRapier } from "@react-three/rapier";
import * as THREE from "three";
import { DoubleSide, MeshPhysicalMaterial, Color } from "three";

function Builder({ url, ...props }) {
  const { rapier, world } = useRapier();
  const ref = useRef();
  const rigidRef = useRef();
  const colorRef = useRef();
  const opacityRef = useRef();
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  const texture = useTexture(url);
  var kinPos = new THREE.Vector3([1, 1, 1]);
  const cubeMaterial = new THREE.MeshPhysicalMaterial({
    color: new Color("#AD20EF")
  });

  const collisionEnter = () => {};
  const collisionExit = () => {
    click(true);
    //myMesh1.current.setNextKinematicTranslation([10, 10, 10]);
    console.log(rigidRef.current.handle);
    const rigg = world.getRigidBody(rigidRef.current.handle);
    console.log("stopme", rigg);
    world.removeRigidBody(rigg);
  };

  useEffect(() => {
    if (hovered === false) {
      console.log("a");
      const timer1 = setTimeout(() => {
        click(true);
        hover(true);
        console.log("yop");
      }, 10);

      const timer = setTimeout(() => {
        click(false);
        console.log("yop");
      }, 2000);
    }
  });

  useFrame((state, delta) => {
    easing.damp(
      colorRef.current.material,
      "opacity",
      clicked ? 0.0 : 1,
      0.25,
      delta
    );
    easing.damp(ref.current.material, "speed", clicked ? 4 : 0, 0.25, delta);
    easing.dampE(
      ref.current.rotation,
      clicked ? [0, (Math.PI / 180) * 180, 0] : [0, 0, 0],
      0.15,
      delta
    );
    easing.damp3(ref.current.scale, clicked ? 0 : 1, 0.2, delta);
    //easing.damp3(ref.current.scale, clicked ? 0 : 1, 0.25, delta);
    easing.dampC(
      colorRef.current.material.color,
      clicked ? "#ef2060" : "#AD20EF",
      0.15,
      delta
    );

    easing.damp3(kinPos, clicked ? [0, -50, 0] : [0, 0, 0], 0.2, delta);
  });
  return (
    <group>
      <mesh ref={ref} {...props}>
        <RigidBody
          type="fixed"
          ref={rigidRef}
          colliders="cuboid"
          collisionGroups={interactionGroups(8, [0, 1, 2])}
          onCollisionEnter={() => collisionEnter()}
          onCollisionExit={() => collisionExit()}
          gravityScale={1}
          name="marble"
          mass={1000}
          restitution={0}
          friction={0}
          linearDamping={0.0}
          angularDamping={1}
        >
          <RoundedBox
            ref={colorRef}
            args={[0.75, 0.75, 0.75]}
            radius={0.15}
            smoothness={7}
            material={cubeMaterial}
          />
        </RigidBody>
        <mesh position={[0, 0, 22.52]}>
          <planeGeometry args={[43, 43]} />
          <meshBasicMaterial
            ref={opacityRef}
            map={texture}
            transparent={true}
            side={DoubleSide}
            opacity={0.0}
          />
        </mesh>
      </mesh>
    </group>
  );
}
function Row() {
  return (
    <>
      <group>
        <Builder url="/1.png" position={[0, 0.375, 0]} />
        <Builder url="/2.png" position={[0.8, 0.375, -0.8]} />
        <Builder url="/2.png" position={[-0.8, 0.375, -0.8]} />
        <Builder url="/2.png" position={[1.6, 0.375, -1.6]} />
        <Builder url="/2.png" position={[-1.6, 0.375, -1.6]} />
        <Builder url="/2.png" position={[2.4, 0.375, -2.4]} />
        <Builder url="/2.png" position={[-2.4, 0.375, -2.4]} />
        <Builder url="/2.png" position={[3.2, 0.375, -3.2]} />
        <Builder url="/2.png" position={[-3.2, 0.375, -3.2]} />
        <Builder url="/2.png" position={[4.0, 0.375, -4.0]} />
        <Builder url="/2.png" position={[-4.0, 0.375, -4.0]} />
      </group>
      <group>
        <Builder url="/1.png" position={[0, 0.375, -1.6]} />
        <Builder url="/2.png" position={[0.8, 0.375, -2.4]} />
        <Builder url="/2.png" position={[-0.8, 0.375, -2.4]} />
        <Builder url="/2.png" position={[1.6, 0.375, -3.2]} />
        <Builder url="/2.png" position={[-1.6, 0.375, -3.2]} />
        <Builder url="/2.png" position={[2.4, 0.375, -4.0]} />
        <Builder url="/2.png" position={[-2.4, 0.375, -4.0]} />
        <Builder url="/2.png" position={[3.2, 0.375, -4.8]} />
        <Builder url="/2.png" position={[-3.2, 0.375, -4.8]} />
      </group>
      <group>
        <Builder url="/1.png" position={[0, 0.375, -3.2]} />
        <Builder url="/2.png" position={[0.8, 0.375, -4.0]} />
        <Builder url="/2.png" position={[-0.8, 0.375, -4.0]} />
        <Builder url="/2.png" position={[1.6, 0.375, -4.8]} />
        <Builder url="/2.png" position={[-1.6, 0.375, -4.8]} />
        <Builder url="/2.png" position={[2.4, 0.375, -5.6]} />
        <Builder url="/2.png" position={[-2.4, 0.375, -5.6]} />
      </group>
    </>
  );
}

export default function Bricks() {
  return (
    <group>
      <Row />
    </group>
  );
}
