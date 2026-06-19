import { useRef, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { useStore } from '../../store/useStore';
import { AddonObjectModel } from './AddonObjectModel';

interface AddonObjectProps {
  item: any;
}

export function AddonObject({ item }: AddonObjectProps) {
  const { camera } = useThree();

  const selectedId = useStore((s) => s.selectedId);
  const selectFurniture = useStore((s) => s.selectFurniture);

  const updateAddonObject = useStore((s) => s.updateAddonObject);

  const isSelected = selectedId === item.id;

  const isDragging = useRef(false);

  const dragOffset = useRef({
    x: 0,
    z: 0,
  });

  const floorPlane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
    []
  );

  const getFloorPoint = useCallback(
    (
      clientX: number,
      clientY: number,
      canvas: HTMLElement
    ): THREE.Vector3 | null => {
      const rect = canvas.getBoundingClientRect();

      const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -((clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();

      raycaster.setFromCamera(
        new THREE.Vector2(nx, ny),
        camera
      );

      const target = new THREE.Vector3();

      const hit = raycaster.ray.intersectPlane(
        floorPlane,
        target
      );

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

        const pt = getFloorPoint(
          me.clientX,
          me.clientY,
          target
        );

        if (!pt) return;

        updateAddonObject(item.id, {
          position: {
            x: pt.x - dragOffset.current.x,
            z: pt.z - dragOffset.current.z,
          },
        });
      };

      const onUp = () => {
        isDragging.current = false;

        window.removeEventListener(
          'pointermove',
          onMove
        );

        window.removeEventListener(
          'pointerup',
          onUp
        );
      };

      window.addEventListener(
        'pointermove',
        onMove
      );

      window.addEventListener(
        'pointerup',
        onUp
      );
    },
    [
      item,
      selectFurniture,
      updateAddonObject,
      getFloorPoint,
    ]
  );

  return (
    <group
      position={[
        item.position.x,
        0,
        item.position.z,
      ]}
      rotation={[
        0,
        (item.rotation * Math.PI) / 180,
        0,
      ]}
      onPointerDown={onPointerDown}
    >
      <AddonObjectModel
        type={item.type}
        dimensions={item.dimensions}
        color={item.color}
        isSelected={isSelected}
        isOutOfBounds={item.outOfBounds ?? false}
      />
    </group>
  );
}