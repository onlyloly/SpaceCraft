import type { FurnitureType, FurnitureDimensions } from '../../types';
import { DEFAULT_DIMENSIONS } from '../../lib/utils';

interface MatProps {
  color: string;
  isOutOfBounds: boolean;
  roughness?: number;
  metalness?: number;
}

function FM({ color, isOutOfBounds, roughness = 0.78, metalness = 0.04 }: MatProps) {
  return (
    <meshStandardMaterial
      color={isOutOfBounds ? '#e53e3e' : color}
      roughness={roughness}
      metalness={metalness}
      transparent={isOutOfBounds}
      opacity={isOutOfBounds ? 0.72 : 1}
    />
  );
}

function blend(hex: string, factor: number): string {
  if (!hex.startsWith('#') || hex.length < 7) return hex;
  const r = Math.round(parseInt(hex.slice(1, 3), 16) * factor);
  const g = Math.round(parseInt(hex.slice(3, 5), 16) * factor);
  const b = Math.round(parseInt(hex.slice(5, 7), 16) * factor);
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  return `#${clamp(r).toString(16).padStart(2, '0')}${clamp(g).toString(16).padStart(2, '0')}${clamp(b).toString(16).padStart(2, '0')}`;
}

interface ModelProps {
  color: string;
  isOutOfBounds: boolean;
}

function WardrobeModel({ color, isOutOfBounds }: ModelProps) {
  const dark = blend(color, 0.82);
  const mid = blend(color, 0.92);
  const ob = isOutOfBounds;

  return (
    <group>
      <mesh position={[0, 1.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 2.1, 0.6]} />
        <FM color={color} isOutOfBounds={ob} />
      </mesh>
      <mesh position={[-0.455, 1.05, 0.295]} castShadow>
        <boxGeometry args={[0.86, 1.94, 0.04]} />
        <FM color={mid} isOutOfBounds={ob} />
      </mesh>
      <mesh position={[0.455, 1.05, 0.295]} castShadow>
        <boxGeometry args={[0.86, 1.94, 0.04]} />
        <FM color={mid} isOutOfBounds={ob} />
      </mesh>
      <mesh position={[-0.09, 1.05, 0.323]}>
        <boxGeometry args={[0.042, 0.15, 0.032]} />
        <FM color="#9B8E7E" isOutOfBounds={ob} roughness={0.3} metalness={0.35} />
      </mesh>
      <mesh position={[0.09, 1.05, 0.323]}>
        <boxGeometry args={[0.042, 0.15, 0.032]} />
        <FM color="#9B8E7E" isOutOfBounds={ob} roughness={0.3} metalness={0.35} />
      </mesh>
      <mesh position={[0, 2.065, 0]}>
        <boxGeometry args={[1.82, 0.042, 0.62]} />
        <FM color={dark} isOutOfBounds={ob} />
      </mesh>
      <mesh position={[0, 0.042, 0]}>
        <boxGeometry args={[1.82, 0.084, 0.62]} />
        <FM color={dark} isOutOfBounds={ob} />
      </mesh>
    </group>
  );
}

function SofaModel({ color, isOutOfBounds }: ModelProps) {
  const dark = blend(color, 0.82);
  const mid = blend(color, 0.9);
  const leg = '#5A4A3A';
  const ob = isOutOfBounds;

  return (
    <group>
      <mesh position={[0, 0.22, 0.1]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 0.38, 0.72]} />
        <FM color={color} isOutOfBounds={ob} />
      </mesh>
      <mesh position={[0, 0.57, -0.31]} castShadow>
        <boxGeometry args={[2.0, 0.64, 0.22]} />
        <FM color={dark} isOutOfBounds={ob} />
      </mesh>
      <mesh position={[-0.9, 0.36, 0.04]} castShadow>
        <boxGeometry args={[0.2, 0.52, 0.88]} />
        <FM color={mid} isOutOfBounds={ob} />
      </mesh>
      <mesh position={[0.9, 0.36, 0.04]} castShadow>
        <boxGeometry args={[0.2, 0.52, 0.88]} />
        <FM color={mid} isOutOfBounds={ob} />
      </mesh>
      <mesh position={[-0.48, 0.44, 0.13]}>
        <boxGeometry args={[0.6, 0.1, 0.64]} />
        <FM color={blend(color, 1.05 > 1 ? 0.98 : 1.05)} isOutOfBounds={ob} roughness={0.92} />
      </mesh>
      <mesh position={[0.48, 0.44, 0.13]}>
        <boxGeometry args={[0.6, 0.1, 0.64]} />
        <FM color={blend(color, 0.98)} isOutOfBounds={ob} roughness={0.92} />
      </mesh>
      {([[-0.85, -0.35], [-0.85, 0.35], [0.85, -0.35], [0.85, 0.35]] as const).map(([lx, lz], i) => (
        <mesh key={i} position={[lx, 0.04, lz]}>
          <boxGeometry args={[0.07, 0.08, 0.07]} />
          <FM color={leg} isOutOfBounds={ob} roughness={0.42} metalness={0.08} />
        </mesh>
      ))}
    </group>
  );
}

function BedModel({ color, isOutOfBounds }: ModelProps) {
  const dark = blend(color, 0.82);
  const leg = blend(color, 0.72);
  const ob = isOutOfBounds;

  return (
    <group>
      <mesh position={[0, 0.14, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.28, 2.0]} />
        <FM color={color} isOutOfBounds={ob} />
      </mesh>
      <mesh position={[0, 0.36, 0.04]} castShadow>
        <boxGeometry args={[1.5, 0.22, 1.84]} />
        <FM color="#F5F0E8" isOutOfBounds={ob} roughness={0.92} />
      </mesh>
      <mesh position={[0, 0.72, -0.96]} castShadow>
        <boxGeometry args={[1.6, 0.96, 0.1]} />
        <FM color={dark} isOutOfBounds={ob} />
      </mesh>
      <mesh position={[0, 1.22, -0.96]}>
        <boxGeometry args={[1.6, 0.06, 0.16]} />
        <FM color={blend(dark, 0.9)} isOutOfBounds={ob} />
      </mesh>
      <mesh position={[-0.32, 0.52, -0.72]}>
        <boxGeometry args={[0.56, 0.1, 0.38]} />
        <FM color="#FFFFFF" isOutOfBounds={ob} roughness={0.95} />
      </mesh>
      <mesh position={[0.32, 0.52, -0.72]}>
        <boxGeometry args={[0.56, 0.1, 0.38]} />
        <FM color="#FFFFFF" isOutOfBounds={ob} roughness={0.95} />
      </mesh>
      {([[-0.72, -0.92], [0.72, -0.92], [-0.72, 0.92], [0.72, 0.92]] as const).map(([lx, lz], i) => (
        <mesh key={i} position={[lx, 0.04, lz]}>
          <boxGeometry args={[0.08, 0.08, 0.08]} />
          <FM color={leg} isOutOfBounds={ob} roughness={0.38} metalness={0.08} />
        </mesh>
      ))}
    </group>
  );
}

function TableModel({ color, isOutOfBounds }: ModelProps) {
  const legColor = blend(color, 0.8);
  const ob = isOutOfBounds;

  return (
    <group>
      <mesh position={[0, 0.73, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.052, 0.7]} />
        <FM color={color} isOutOfBounds={ob} />
      </mesh>
      <mesh position={[0, 0.695, 0]}>
        <boxGeometry args={[1.18, 0.03, 0.68]} />
        <FM color={blend(color, 0.88)} isOutOfBounds={ob} />
      </mesh>
      {([[-0.54, -0.3], [0.54, -0.3], [-0.54, 0.3], [0.54, 0.3]] as const).map(([lx, lz], i) => (
        <mesh key={i} position={[lx, 0.355, lz]} castShadow>
          <boxGeometry args={[0.052, 0.71, 0.052]} />
          <FM color={legColor} isOutOfBounds={ob} roughness={0.42} metalness={0.04} />
        </mesh>
      ))}
    </group>
  );
}

function DresserModel({ color, isOutOfBounds }: ModelProps) {
  const dark = blend(color, 0.85);
  const mid = blend(color, 0.92);
  const handle = '#9B8E7E';
  const ob = isOutOfBounds;

  const drawerYs = [0.735, 0.445, 0.155] as const;

  return (
    <group>
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.0, 0.9, 0.5]} />
        <FM color={color} isOutOfBounds={ob} />
      </mesh>
      <mesh position={[0, 0.917, 0]}>
        <boxGeometry args={[1.02, 0.042, 0.52]} />
        <FM color={dark} isOutOfBounds={ob} />
      </mesh>
      {drawerYs.map((y, i) => (
        <group key={i}>
          <mesh position={[0, y, 0.242]}>
            <boxGeometry args={[0.9, 0.25, 0.032]} />
            <FM color={mid} isOutOfBounds={ob} />
          </mesh>
          <mesh position={[0, y, 0.264]}>
            <boxGeometry args={[0.13, 0.026, 0.026]} />
            <FM color={handle} isOutOfBounds={ob} roughness={0.3} metalness={0.38} />
          </mesh>
        </group>
      ))}
      {([[-0.44, -0.22], [0.44, -0.22], [-0.44, 0.22], [0.44, 0.22]] as const).map(([lx, lz], i) => (
        <mesh key={i} position={[lx, 0.042, lz]}>
          <boxGeometry args={[0.06, 0.084, 0.06]} />
          <FM color={dark} isOutOfBounds={ob} roughness={0.38} metalness={0.06} />
        </mesh>
      ))}
    </group>
  );
}

function NightstandModel({ color, isOutOfBounds }: ModelProps) {
  const dark = blend(color, 0.84);
  const mid = blend(color, 0.92);
  const handle = '#9B8E7E';
  const ob = isOutOfBounds;

  return (
    <group>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.6, 0.4]} />
        <FM color={color} isOutOfBounds={ob} />
      </mesh>
      <mesh position={[0, 0.624, 0]}>
        <boxGeometry args={[0.52, 0.042, 0.42]} />
        <FM color={dark} isOutOfBounds={ob} />
      </mesh>
      <mesh position={[0, 0.445, 0.196]}>
        <boxGeometry args={[0.43, 0.25, 0.032]} />
        <FM color={mid} isOutOfBounds={ob} />
      </mesh>
      <mesh position={[0, 0.445, 0.218]}>
        <boxGeometry args={[0.09, 0.022, 0.022]} />
        <FM color={handle} isOutOfBounds={ob} roughness={0.3} metalness={0.38} />
      </mesh>
      <mesh position={[0, 0.155, 0.196]}>
        <boxGeometry args={[0.43, 0.25, 0.032]} />
        <FM color={mid} isOutOfBounds={ob} />
      </mesh>
      <mesh position={[0, 0.155, 0.218]}>
        <boxGeometry args={[0.09, 0.022, 0.022]} />
        <FM color={handle} isOutOfBounds={ob} roughness={0.3} metalness={0.38} />
      </mesh>
      {([[-0.2, -0.16], [0.2, -0.16], [-0.2, 0.16], [0.2, 0.16]] as const).map(([lx, lz], i) => (
        <mesh key={i} position={[lx, 0.032, lz]}>
          <boxGeometry args={[0.042, 0.064, 0.042]} />
          <FM color={dark} isOutOfBounds={ob} roughness={0.38} metalness={0.06} />
        </mesh>
      ))}
    </group>
  );
}

interface FurnitureModelProps {
  type: FurnitureType;
  dimensions: FurnitureDimensions;
  color: string;
  isSelected: boolean;
  isOutOfBounds: boolean;
}

export function FurnitureModel({ type, dimensions, color, isSelected, isOutOfBounds }: FurnitureModelProps) {
  const defaults = DEFAULT_DIMENSIONS[type];
  const scale: [number, number, number] = [
    dimensions.width / defaults.width,
    dimensions.height / defaults.height,
    dimensions.depth / defaults.depth,
  ];

  const props = { color, isOutOfBounds, isSelected };

  return (
    <group scale={scale}>
      {type === 'wardrobe'   && <WardrobeModel   {...props} />}
      {type === 'sofa'       && <SofaModel       {...props} />}
      {type === 'bed'        && <BedModel         {...props} />}
      {type === 'table'      && <TableModel       {...props} />}
      {type === 'dresser'    && <DresserModel     {...props} />}
      {type === 'nightstand' && <NightstandModel  {...props} />}
    </group>
  );
}
