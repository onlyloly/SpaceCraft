import { useMemo } from 'react';
import * as THREE from 'three';
import { Grid } from '@react-three/drei';
import type { RoomConfig } from '../../types';

interface RoomProps {
  room: RoomConfig;
}

export function Room({ room }: RoomProps) {
  const { width, depth, height } = room;

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#E8DDD0" roughness={0.88} metalness={0.02} />
      </mesh>

      {/* Grid overlay */}
      <Grid
        position={[0, 0.002, 0]}
        args={[width, depth]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#C4A882"
        sectionSize={1}
        sectionThickness={1}
        sectionColor="#A08060"
        fadeDistance={50}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={false}
      />

      {/* Back wall (–Z) */}
      <mesh position={[0, height / 2, -depth / 2]} receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#F2EEE8" roughness={0.92} side={THREE.FrontSide} />
      </mesh>

      {/* Front wall (+Z) */}
      <mesh position={[0, height / 2, depth / 2]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#F2EEE8" roughness={0.92} side={THREE.FrontSide} />
      </mesh>

      {/* Left wall (–X) */}
      <mesh position={[-width / 2, height / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial color="#EDE8E0" roughness={0.92} side={THREE.FrontSide} />
      </mesh>

      {/* Right wall (+X) */}
      <mesh position={[width / 2, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial color="#EDE8E0" roughness={0.92} side={THREE.FrontSide} />
      </mesh>

      {/* Skirting boards */}
      <mesh position={[0, 0.04, depth / 2 - 0.03]} receiveShadow>
        <boxGeometry args={[width, 0.08, 0.04]} />
        <meshStandardMaterial color="#D4C4B0" roughness={0.82} />
      </mesh>
      <mesh position={[0, 0.04, -depth / 2 + 0.03]} receiveShadow>
        <boxGeometry args={[width, 0.08, 0.04]} />
        <meshStandardMaterial color="#D4C4B0" roughness={0.82} />
      </mesh>
      <mesh position={[-width / 2 + 0.03, 0.04, 0]} receiveShadow>
        <boxGeometry args={[0.04, 0.08, depth]} />
        <meshStandardMaterial color="#D4C4B0" roughness={0.82} />
      </mesh>
      <mesh position={[width / 2 - 0.03, 0.04, 0]} receiveShadow>
        <boxGeometry args={[0.04, 0.08, depth]} />
        <meshStandardMaterial color="#D4C4B0" roughness={0.82} />
      </mesh>

      {/* Dimension annotations */}
      <DimensionLine
        start={[-width / 2, 0, depth / 2 + 0.35]}
        end={[width / 2, 0, depth / 2 + 0.35]}
        label={`${width.toFixed(1)} м`}
      />
      <DimensionLine
        start={[width / 2 + 0.35, 0, -depth / 2]}
        end={[width / 2 + 0.35, 0, depth / 2]}
        label={`${depth.toFixed(1)} м`}
      />
    </group>
  );
}

interface DimensionLineProps {
  start: [number, number, number];
  end: [number, number, number];
  label: string;
}

function DimensionLine({ start, end }: DimensionLineProps) {
  const points = useMemo(
    () => [new THREE.Vector3(...start), new THREE.Vector3(...end)],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [start[0], start[2], end[0], end[2]]
  );

  const lineGeom = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    <lineSegments geometry={lineGeom}>
      <lineBasicMaterial color="#B09878" />
    </lineSegments>
  );
}
