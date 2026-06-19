import type { ArchitecturalOpening, RoomSizeForOpenings } from '../../types/spacecraftAddons';
import { getOpeningTransform } from '../../lib/openingUtils';

interface Props { opening: ArchitecturalOpening; room: RoomSizeForOpenings; isSelected?: boolean; onClick?: (id: string) => void; }

export function ArchitecturalOpeningModel({ opening, room, isSelected = false, onClick }: Props) {
  const { position, rotation } = getOpeningTransform(opening, room);
  return <group position={position} rotation={rotation} onPointerDown={(e) => { e.stopPropagation(); onClick?.(opening.id); }}>{opening.type === 'window' ? <WindowView opening={opening} selected={isSelected} /> : <DoorView opening={opening} selected={isSelected} />}</group>;
}

function WindowView({ opening, selected }: { opening: ArchitecturalOpening; selected: boolean }) {
  const frame = selected ? '#8B6F47' : opening.color;
  return <group>
    <mesh><boxGeometry args={[opening.width, opening.height, 0.018]} /><meshPhysicalMaterial color={opening.glassColor || '#AFC8D1'} roughness={0.08} transparent opacity={0.46} transmission={0.28} /></mesh>
    <Frame width={opening.width} height={opening.height} color={frame} />
    <mesh position={[0, 0, 0.023]}><boxGeometry args={[opening.width, 0.025, 0.04]} /><meshStandardMaterial color={frame} /></mesh>
    <mesh position={[0, 0, 0.024]}><boxGeometry args={[0.025, opening.height, 0.04]} /><meshStandardMaterial color={frame} /></mesh>
    <pointLight position={[0, 0, 0.28]} intensity={0.18} color="#E8F5FF" distance={4} />
  </group>;
}

function DoorView({ opening, selected }: { opening: ArchitecturalOpening; selected: boolean }) {
  const doorColor = opening.color || '#A87954';
  const handleX = opening.openDirection === 'left' ? -opening.width * 0.34 : opening.width * 0.34;
  return <group>
    <mesh position={[0, 0, 0.014]} castShadow><boxGeometry args={[opening.width, opening.height, 0.045]} /><meshStandardMaterial color={doorColor} roughness={0.62} /></mesh>
    <mesh position={[0, 0, 0.041]}><boxGeometry args={[opening.width * 0.82, opening.height * 0.72, 0.012]} /><meshStandardMaterial color={multiplyColor(doorColor, 0.88)} /></mesh>
    <mesh position={[handleX, 0.05, 0.07]} castShadow><sphereGeometry args={[0.045, 18, 12]} /><meshStandardMaterial color="#C4A882" roughness={0.28} metalness={0.45} /></mesh>
    <Frame width={opening.width} height={opening.height} color={selected ? '#8B6F47' : '#D4C4B0'} />
  </group>;
}

function Frame({ width, height, color }: { width: number; height: number; color: string }) {
  return <group>
    <mesh position={[0, height / 2, 0.025]}><boxGeometry args={[width + 0.12, 0.06, 0.06]} /><meshStandardMaterial color={color} /></mesh>
    <mesh position={[0, -height / 2, 0.025]}><boxGeometry args={[width + 0.12, 0.06, 0.06]} /><meshStandardMaterial color={color} /></mesh>
    <mesh position={[-width / 2, 0, 0.025]}><boxGeometry args={[0.06, height + 0.12, 0.06]} /><meshStandardMaterial color={color} /></mesh>
    <mesh position={[width / 2, 0, 0.025]}><boxGeometry args={[0.06, height + 0.12, 0.06]} /><meshStandardMaterial color={color} /></mesh>
  </group>;
}

function multiplyColor(hex: string, factor: number) {
  if (!hex.startsWith('#') || hex.length < 7) return hex;
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  const r = Math.round(parseInt(hex.slice(1, 3), 16) * factor);
  const g = Math.round(parseInt(hex.slice(3, 5), 16) * factor);
  const b = Math.round(parseInt(hex.slice(5, 7), 16) * factor);
  return `#${clamp(r).toString(16).padStart(2, '0')}${clamp(g).toString(16).padStart(2, '0')}${clamp(b).toString(16).padStart(2, '0')}`;
}
