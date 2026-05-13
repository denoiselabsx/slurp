"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import { Float, useGLTF } from "@react-three/drei";

const MODEL_URL = "/classic_ramen.glb";

// Preload so all instances (hero + 6 menu cards) share the same parsed buffer
useGLTF.preload(MODEL_URL);

function Steam() {
  const group = useRef<THREE.Group>(null);
  const count = 14;
  const particles = useMemo(
    () =>
      new Array(count).fill(0).map(() => ({
        x: (Math.random() - 0.5) * 0.7,
        z: (Math.random() - 0.5) * 0.7,
        startY: 0.1 + Math.random() * 0.15,
        scale: 0.25 + Math.random() * 0.45,
        speed: 0.18 + Math.random() * 0.25,
        offset: Math.random() * 10,
        rot: Math.random() * Math.PI,
      })),
    [],
  );

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.children.forEach((child, i) => {
      const p = particles[i];
      const life = ((t * p.speed + p.offset) % 3) / 3;
      child.position.y = p.startY + life * 1.8;
      child.position.x = p.x + Math.sin(t * 0.6 + i) * 0.08 * life;
      child.position.z = p.z + Math.cos(t * 0.5 + i) * 0.08 * life;
      const s = p.scale * (0.4 + life * 1.4);
      child.scale.set(s, s, s);
      const m = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      m.opacity = (1 - life) * 0.45;
    });
  });

  return (
    <group ref={group}>
      {particles.map((p, i) => (
        <mesh key={i} rotation={[0, p.rot, 0]}>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshBasicMaterial
            color="#fff8e8"
            transparent
            opacity={0.3}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

type BowlProps = ThreeElements["group"] & { showSteam?: boolean };

export function RamenBowl({ showSteam = true, ...props }: BowlProps) {
  const { scene } = useGLTF(MODEL_URL);

  // Clone so multiple instances on the page don't share transforms
  const cloned = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        // Slightly tone the material so the chili palette pops
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat && "roughness" in mat) {
          mat.roughness = Math.min(1, mat.roughness ?? 0.6);
          mat.envMapIntensity = 0.9;
        }
      }
    });
    return c;
  }, [scene]);

  // Measure the GLB once: center it at origin, scale it to a known size.
  // We apply the offset *inside* the scaled group so the math is consistent:
  // child position is in unscaled local space.
  const { offset, fitScale } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const target = 2.2;
    return {
      offset: [-center.x, -center.y, -center.z] as [number, number, number],
      fitScale: target / maxDim,
    };
  }, [cloned]);

  return (
    <group {...props}>
      <group scale={fitScale}>
        <primitive object={cloned} position={offset} />
      </group>
      {showSteam && (
        <group position={[0, 0.6, 0]}>
          <Steam />
        </group>
      )}
    </group>
  );
}

export function FloatingBowl(props: BowlProps) {
  return (
    <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.35}>
      <RamenBowl {...props} />
    </Float>
  );
}
