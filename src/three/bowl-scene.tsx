"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Float, ContactShadows, Environment } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";

const MODEL_URL = "/classic_ramen.glb";

/**
 * One canonical Bowl primitive. Loaded once via useGLTF (URL-cached), then
 * cloned per instance using SkeletonUtils so the same scene graph isn't
 * mounted twice in the WebGL tree.
 */
function BowlMesh({
  variantColor,
  emissive,
}: {
  variantColor?: string;
  emissive?: string;
}) {
  const { scene } = useGLTF(MODEL_URL);

  // Clone so multiple Views can render the same model without conflict.
  const cloned = useMemo(() => {
    const c = SkeletonUtils.clone(scene);
    c.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const original = mesh.material as THREE.MeshStandardMaterial;
        if (original && "color" in original) {
          // Material *instance* per clone so per-variant tinting works.
          const mat = original.clone();
          if (variantColor) {
            mat.color = new THREE.Color(variantColor).multiplyScalar(0.9);
          }
          if (emissive) {
            mat.emissive = new THREE.Color(emissive);
            mat.emissiveIntensity = 0.18;
          }
          mat.envMapIntensity = 0.9;
          mat.roughness = Math.min(1, (mat.roughness ?? 0.6) + 0.05);
          mesh.material = mat;
        }
      }
    });
    return c;
  }, [scene, variantColor, emissive]);

  // Auto-center + fit
  const { offset, fitScale } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const target = 2.0;
    return {
      offset: [-center.x, -center.y, -center.z] as [number, number, number],
      fitScale: target / maxDim,
    };
  }, [cloned]);

  return (
    <group scale={fitScale}>
      <primitive object={cloned} position={offset} />
    </group>
  );
}

/**
 * Instanced steam — 60 billboarded soft alpha planes rising from the bowl.
 * Cheap (one instanced draw call), reads as steam against the cream bg.
 */
function Steam({ count = 60, area = 0.6 }: { count?: number; area?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(
    () =>
      new Array(count).fill(0).map(() => ({
        x: (Math.random() - 0.5) * area,
        z: (Math.random() - 0.5) * area,
        startY: 0.05 + Math.random() * 0.12,
        scale: 0.18 + Math.random() * 0.32,
        speed: 0.12 + Math.random() * 0.22,
        offset: Math.random() * 4,
        drift: Math.random() * 0.06,
      })),
    [count, area],
  );

  // Soft-circle alpha texture generated procedurally on the GPU side
  const tex = useMemo(() => {
    const size = 64;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    );
    g.addColorStop(0, "rgba(255,250,235,0.6)");
    g.addColorStop(0.4, "rgba(255,250,235,0.15)");
    g.addColorStop(1, "rgba(255,250,235,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const t = new THREE.CanvasTexture(c);
    t.premultiplyAlpha = true;
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  useFrame(({ clock, camera }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      const p = particles[i];
      const life = ((t * p.speed + p.offset) % 3) / 3;
      const y = p.startY + life * 1.6;
      dummy.position.set(
        p.x + Math.sin(t * 0.5 + i) * p.drift,
        y,
        p.z + Math.cos(t * 0.4 + i) * p.drift,
      );
      const s = p.scale * (0.4 + life * 1.8);
      dummy.scale.set(s, s, s);
      dummy.lookAt(camera.position);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt?.(
        i,
        new THREE.Color(1, 1, 1).multiplyScalar(1 - life),
      );
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={tex}
        transparent
        depthWrite={false}
        opacity={0.35}
        blending={THREE.NormalBlending}
      />
    </instancedMesh>
  );
}

/**
 * Lighting rig tuned for chili-red palette: warm key + chili rim +
 * point light *inside* the bowl to simulate broth glow.
 */
function BowlLights() {
  return (
    <>
      <ambientLight intensity={0.18} color="#fef3d9" />
      <directionalLight
        position={[3, 4, 2]}
        intensity={2.4}
        color="#fff1e0"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-2, 1.5, -2]} intensity={0.9} color="#d83a1c" />
      <pointLight
        position={[0, -0.05, 0.4]}
        intensity={1.3}
        color="#f17b2e"
        distance={2.4}
        decay={1.5}
      />
      <Environment preset="sunset" environmentIntensity={0.55} />
    </>
  );
}

function AmbientSpin({ children, speed = 0.08 }: { children: React.ReactNode; speed?: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * speed;
  });
  return <group ref={ref}>{children}</group>;
}

/**
 * The main scene used in the Hero — float wobble + ambient spin + mouse tilt (parent).
 */
export function HeroBowlScene() {
  return (
    <>
      <BowlLights />
      <Float speed={1.1} rotationIntensity={0.18} floatIntensity={0.28}>
        <AmbientSpin speed={0.12}>
          <group position={[0, -0.05, 0]}>
            <BowlMesh />
          </group>
        </AmbientSpin>
        <group position={[0, 0.45, 0]}>
          <Steam count={28} area={0.45} />
        </group>
      </Float>
      <ContactShadows
        position={[0, -0.95, 0]}
        opacity={0.3}
        scale={4.5}
        blur={2.6}
        far={3}
        color="#1a1410"
      />
    </>
  );
}

/**
 * Variant used in menu cards — tinted broth, no steam, gentle continuous spin.
 */
export function MenuBowlScene({
  spin = true,
  variantColor,
  emissive,
}: {
  spin?: boolean;
  variantColor?: string;
  emissive?: string;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!ref.current || !spin) return;
    ref.current.rotation.y += dt * 0.35;
  });
  return (
    <>
      <BowlLights />
      <group ref={ref}>
        <BowlMesh variantColor={variantColor} emissive={emissive} />
      </group>
      <ContactShadows
        position={[0, -0.9, 0]}
        opacity={0.35}
        scale={3.5}
        blur={2.4}
        far={2.5}
        color="#1a1410"
      />
    </>
  );
}

useGLTF.preload(MODEL_URL);
