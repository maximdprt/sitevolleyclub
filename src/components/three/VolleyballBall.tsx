"use client";

import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";

function createBallTexture() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#F0F7FF";
  ctx.fillRect(0, 0, size, size);

  const panels = [
    { color: "#F0F7FF" },
    { color: "#1A3A5C" },
    { color: "#E8610A" },
    { color: "#F0F7FF" },
    { color: "#1A3A5C" },
    { color: "#E8610A" },
  ];

  const cols = 3;
  const rows = 2;
  const w = size / cols;
  const h = size / rows;
  let idx = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      ctx.fillStyle = panels[idx % panels.length]!.color;
      ctx.fillRect(c * w, r * h, w, h);
      idx++;
    }
  }

  ctx.strokeStyle = "rgba(0,0,0,0.6)";
  ctx.lineWidth = 6;
  for (let c = 1; c < cols; c++) {
    ctx.beginPath();
    ctx.moveTo(c * w, 0);
    ctx.lineTo(c * w, size);
    ctx.stroke();
  }
  for (let r = 1; r < rows; r++) {
    ctx.beginPath();
    ctx.moveTo(0, r * h);
    ctx.lineTo(size, r * h);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 1);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function VolleyballBall() {
  const meshRef = useRef<THREE.Mesh>(null);

  const map = useMemo(() => {
    if (typeof document === "undefined") return null;
    return createBallTexture();
  }, []);

  useFrame(({ clock }) => {
    const m = meshRef.current;
    if (!m) return;
    const t = clock.getElapsedTime();
    m.rotation.y += 0.003;
    m.position.y = 1.2 + Math.sin(t) * 0.15;
  });

  return (
    <mesh ref={meshRef} position={[2.5, 1.2, 0]}>
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshStandardMaterial
        map={map ?? undefined}
        metalness={0.1}
        roughness={0.35}
        color={map ? undefined : "#F0F7FF"}
      />
    </mesh>
  );
}

