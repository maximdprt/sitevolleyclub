"use client";

import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";

export function FloatingNet() {
  const meshRef = useRef<THREE.Mesh>(null);
  const time = useRef(0);

  const geometry = useMemo(() => new THREE.PlaneGeometry(6, 2, 20, 8), []);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    time.current += 0.01;
    const t = time.current;

    const geom = mesh.geometry as THREE.PlaneGeometry;
    const pos = geom.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, Math.sin(x * 1.2 + t) * 0.08 + Math.cos(y * 1.8 + t * 0.8) * 0.05);
    }
    pos.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0, 0.5, -2]} rotation={[-0.05, 0, 0]}>
      <meshBasicMaterial color="#F0F7FF" wireframe transparent opacity={0.15} />
    </mesh>
  );
}

