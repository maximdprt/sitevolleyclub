"use client";

import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export function WaveParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const time = useRef(0);

  const { positions, colors, count } = useMemo(() => {
    const gridX = 60;
    const gridY = 50;
    const count = gridX * gridY;
    const width = 10;
    const height = 7.5;

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    let i = 0;
    for (let y = 0; y < gridY; y++) {
      for (let x = 0; x < gridX; x++) {
        const px = (x / (gridX - 1) - 0.5) * width;
        const py = (y / (gridY - 1) - 0.5) * height;
        positions[i * 3 + 0] = px;
        positions[i * 3 + 1] = py * 0.6;
        positions[i * 3 + 2] = 0;

        colors[i * 3 + 0] = 0.17;
        colors[i * 3 + 1] = 0.5;
        colors[i * 3 + 2] = 0.75;
        i++;
      }
    }

    return { positions, colors, count };
  }, []);

  useFrame(() => {
    const points = pointsRef.current;
    if (!points) return;

    time.current += 0.008;
    const t = time.current;

    const amplitude = 0.8;
    const frequency = 0.3;

    const geom = points.geometry as THREE.BufferGeometry;
    const pos = geom.getAttribute("position") as THREE.BufferAttribute;
    const col = geom.getAttribute("color") as THREE.BufferAttribute;

    // Avoid per-frame object allocations for smoother performance.
    const waveR = 0.1686;
    const waveG = 0.4980;
    const waveB = 0.7490;
    const foamR = 0.9412;
    const foamG = 0.9686;
    const foamB = 1.0;

    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = amplitude * Math.sin(frequency * x + t) * Math.cos(frequency * y * 0.7 + t * 0.8);
      pos.setZ(i, z);

      const mix = THREE.MathUtils.clamp((z + amplitude) / (2 * amplitude), 0, 1);
      col.setXYZ(
        i,
        waveR + (foamR - waveR) * mix,
        waveG + (foamG - waveG) * mix,
        waveB + (foamB - waveB) * mix,
      );
    }

    pos.needsUpdate = true;
    col.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} position={[0, -0.8, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={2.0} sizeAttenuation vertexColors transparent opacity={0.85} />
    </points>
  );
}

