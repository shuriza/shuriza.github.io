"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// SSR-safe mount check without useEffect + setState
const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

// Generate particle data outside of render to avoid impure function calls
function generateParticles(count: number) {
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const speeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    sizes[i] = Math.random() * 3 + 1;
    speeds[i] = Math.random() * 0.5 + 0.1;
  }

  return { positions, sizes, speeds };
}

function Particles({ count = 80 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null);
  const [particles] = useState(() => generateParticles(count));

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.getElapsedTime();
    const positions = mesh.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3 + 1] += Math.sin(time * particles.speeds[i] + i) * 0.002;
      positions[i3] += Math.cos(time * particles.speeds[i] * 0.5 + i) * 0.001;
    }

    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.rotation.y = time * 0.02;
    mesh.current.rotation.x = Math.sin(time * 0.01) * 0.1;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[particles.sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#22d3ee"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.05;
    groupRef.current.rotation.x = Math.sin(time * 0.03) * 0.2;
  });

  return (
    <group ref={groupRef}>
      {/* Floating torus */}
      <mesh position={[3, 2, -2]}>
        <torusGeometry args={[0.5, 0.15, 16, 32]} />
        <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.3} />
      </mesh>

      {/* Floating octahedron */}
      <mesh position={[-3, -1, -3]}>
        <octahedronGeometry args={[0.6]} />
        <meshBasicMaterial color="#0891b2" wireframe transparent opacity={0.25} />
      </mesh>

      {/* Floating icosahedron */}
      <mesh position={[2, -2, -1]}>
        <icosahedronGeometry args={[0.4]} />
        <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.2} />
      </mesh>

      {/* Small cube */}
      <mesh position={[-2, 3, -4]}>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

export default function ParticleField() {
  const isMounted = useIsMounted();

  if (!isMounted) return null;

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <Particles count={80} />
        <FloatingShapes />
      </Canvas>
    </div>
  );
}
