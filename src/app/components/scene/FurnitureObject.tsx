import { useRef, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import type { FurnitureItem } from '../../types';
import { useStore } from '../../store/useStore';
import { FurnitureModel } from './FurnitureModel';

interface FurnitureObjectProps {
  item: FurnitureItem;
}

export function FurnitureObject({ item }: FurnitureObjectProps) {
  const { camera } = useThree();
  const selectFurniture = useStore((s) => s.selectFurniture);
  const moveFurniture = useStore((s) => s.moveFurniture);
  const selectedId = useStore((s) => s.selectedId);
  const isSelected = selectedId === item.id;

  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, z: 0 });
  const floorPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);

  const getFloorPoint = useCallback(
    (clientX: number, clientY: number, canvas: HTMLElement): THREE.Vector3 | null => {
      const rect = canvas.getBoundingClientRect();
      const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -((clientY - rect.top) / rect.height) * 2 + 1;
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(nx, ny), camera);
      const target = new THREE.Vector3();
      const hit = raycaster.ray.intersectPlane(floorPlane, target);
      return hit ? target : null;
    },
    [camera, floorPlane]
  );

  const onPointerDown = useCallback(
    (e: any) => {
      e.stopPropagation();
      selectFurniture(item.id);
      isDragging.current = true;

      dragOffset.current = {
        x: e.point.x - item.position.x,
        z: e.point.z - item.position.z,
      };

      const canvas = e.nativeEvent.target as HTMLElement;
      const root = canvas.closest('canvas') as HTMLElement | null;
      const target = root || canvas;

      const onMove = (me: PointerEvent) => {
        if (!isDragging.current) return;
        const pt = getFloorPoint(me.clientX, me.clientY, target);
        if (pt) {
          moveFurniture(item.id, pt.x - dragOffset.current.x, pt.z - dragOffset.current.z);
        }
      };

      const onUp = () => {
        isDragging.current = false;
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    },
    [item.id, item.position, selectFurniture, moveFurniture, getFloorPoint]
  );

  const rotRad = (item.rotation * Math.PI) / 180;

  return (
    <group
      position={[item.position.x, 0, item.position.z]}
      rotation={[0, rotRad, 0]}
      onPointerDown={onPointerDown}
    >
      <FurnitureModel
        type={item.type}
        dimensions={item.dimensions}
        color={item.color}
        isSelected={isSelected}
        isOutOfBounds={item.outOfBounds}
      />

      {/* Selection indicator */}
      {isSelected && (
        <SelectionBox dimensions={item.dimensions} />
      )}
    </group>
  );
}

function SelectionBox({ dimensions }: { dimensions: { width: number; depth: number; height: number } }) {
  const edges = useMemo(() => {
    const geom = new THREE.BoxGeometry(
      dimensions.width + 0.04,
      dimensions.height + 0.04,
      dimensions.depth + 0.04
    );
    return new THREE.EdgesGeometry(geom);
  }, [dimensions]);

  return (
    <lineSegments
      geometry={edges}
      position={[0, dimensions.height / 2, 0]}
      renderOrder={999}
    >
      <lineBasicMaterial color="#8B6F47" linewidth={2} transparent opacity={0.9} />
    </lineSegments>
  );
}
