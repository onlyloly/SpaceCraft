import { useRef, useEffect, Suspense, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { AddonObjectModel } from './AddonObjectModel';
import { ArchitecturalOpeningModel } from './ArchitecturalOpeningModel';
import { useStore } from '../../store/useStore';
import { Room } from './Room';
import { FurnitureObject } from './FurnitureObject';
import type { CameraMode } from '../../types';
import { AddonObject } from './AddonObject';
interface CameraControllerProps {
  mode: CameraMode;
  orbitRef: React.MutableRefObject<OrbitControlsImpl | null>;
}

function CameraController({ mode, orbitRef }: CameraControllerProps) {
  const { camera } = useThree();

  useEffect(() => {
    const ctrl = orbitRef.current;
    if (!ctrl) return;

    if (mode === '3d') {
      camera.position.set(6, 6, 6);
      ctrl.target.set(0, 0, 0);
      ctrl.minPolarAngle = 0;
      ctrl.maxPolarAngle = Math.PI / 2 - 0.05;
      ctrl.enableRotate = true;
    } else {
      camera.position.set(0, 14, 0.001);
      ctrl.target.set(0, 0, 0);
      ctrl.minPolarAngle = 0;
      ctrl.maxPolarAngle = 0.01;
      ctrl.enableRotate = false;
    }

    ctrl.update();
  }, [mode, camera, orbitRef]);

  return null;
}

function SceneContent({
  orbitRef,
}: {
  orbitRef: React.MutableRefObject<OrbitControlsImpl | null>;
}) {
  const room = useStore((s) => s.room);
  const furniture = useStore((s) => s.furniture);
  const cameraMode = useStore((s) => s.cameraMode);
  const selectFurniture = useStore((s) => s.selectFurniture);
  const addonObjects = useStore((s) => s.addonObjects);
  const openings = useStore((s) => s.openings);

  return (
    <>
      <CameraController mode={cameraMode} orbitRef={orbitRef} />

      <ambientLight intensity={0.55} color="#FFF8F0" />

      <directionalLight
        position={[8, 10, 6]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />

      <directionalLight position={[-5, 8, -4]} intensity={0.35} color="#E8F0FF" />

      <pointLight
        position={[0, room.height * 0.85, 0]}
        intensity={0.4}
        color="#FFF5E0"
        decay={2}
      />

      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={0.28}
        scale={Math.max(room.width, room.depth) * 2}
        blur={2.5}
        far={5}
        color="#3A2E22"
      />

      <Environment preset="apartment" />

      <Room room={room} />

      {furniture.map((item) => (
        <FurnitureObject key={item.id} item={item} />
      ))}

     {addonObjects.map((item) => (
  <AddonObject
    key={item.id}
    item={item}
  />
))}

      {openings.map((opening) => (
        <ArchitecturalOpeningModel
          key={opening.id}
          opening={opening}
          room={room}
        />
      ))}

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        onPointerDown={(event: any) => {
          event.stopPropagation();
          selectFurniture(null);
        }}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </>
  );
}

export function Scene3D() {
  const orbitRef = useRef<OrbitControlsImpl | null>(null);

  return (
    <div className="relative w-full h-full overflow-hidden bg-scene-glass">
      <Canvas
        shadows
        camera={{ position: [6, 6, 6], fov: 48, near: 0.1, far: 200 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        style={{
          width: '100%',
          height: '100%',
          background: 'transparent',
        }}
      >
        <fog attach="fog" args={['#6c5f4f', 35, 90]} />

        <Suspense fallback={null}>
          <SceneContent orbitRef={orbitRef} />
        </Suspense>

        <OrbitControls
          ref={orbitRef}
          makeDefault
          enablePan
          enableZoom
          enableRotate
          minDistance={1.5}
          maxDistance={28}
          target={[0, 0, 0]}
          dampingFactor={0.08}
          enableDamping
        />
      </Canvas>
    </div>
  );
}