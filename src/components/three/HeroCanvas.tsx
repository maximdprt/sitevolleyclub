"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { WaveParticles } from "./WaveParticles";
import { FloatingNet } from "./FloatingNet";

function Scene() {
  const fog = useMemo(() => new THREE.Fog("#0D2237", 8, 20), []);

  useFrame(({ camera, mouse }) => {
    camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (mouse.y * 0.3 + 2 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <primitive object={fog} attach="fog" />
      <ambientLight intensity={0.55} />
      <pointLight position={[4, 2, -1]} intensity={1.4} color="#E8610A" />
      <pointLight position={[-4, 2, 2]} intensity={1.1} color="#2B7FBF" />
      <WaveParticles />
      <FloatingNet />
    </>
  );
}

export default function HeroCanvas() {
  return (
    <Canvas
      style={{ position: "absolute", inset: 0 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      camera={{ fov: 60, position: [0, 2, 8] }}
    >
      <Scene />
    </Canvas>
  );
}

