import type { FurnitureItem, FurnitureType, RoomConfig, SpaceAnalytics, CorridorWarning, FurnitureDimensions } from '../types';

export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;
}

export const DEFAULT_DIMENSIONS: Record<FurnitureType, FurnitureDimensions> = {
  wardrobe:  { width: 1.8, depth: 0.6, height: 2.1 },
  sofa:      { width: 2.0, depth: 0.9, height: 0.85 },
  bed:       { width: 1.6, depth: 2.0, height: 0.5 },
  table:     { width: 1.2, depth: 0.7, height: 0.75 },
  dresser:   { width: 1.0, depth: 0.5, height: 0.9 },
  nightstand:{ width: 0.5, depth: 0.4, height: 0.6 },
};

export const DEFAULT_COLORS: Record<FurnitureType, string> = {
  wardrobe:  '#C4956A',
  sofa:      '#8B7355',
  bed:       '#DDB891',
  table:     '#A0785A',
  dresser:   '#C4956A',
  nightstand:'#A8917A',
};

export const FURNITURE_PRESETS_COLORS = [
  '#C4956A', '#A0785A', '#8B7355', '#DDB891', '#A8917A',
  '#6B8E6B', '#7B9E87', '#5C7A7A', '#8B8B6B', '#A09060',
  '#C4A882', '#E8D5B0', '#D4B896', '#B8926A', '#8B5E3C',
  '#9E9E9E', '#707070', '#4A4A4A', '#F5F0E8', '#E0D8CC',
];

export function getRotatedAABBHalfExtents(
  dims: FurnitureDimensions,
  rotationDeg: number
): { halfW: number; halfD: number } {
  const θ = (rotationDeg * Math.PI) / 180;
  const hw = dims.width / 2;
  const hd = dims.depth / 2;
  return {
    halfW: Math.abs(hw * Math.cos(θ)) + Math.abs(hd * Math.sin(θ)),
    halfD: Math.abs(hw * Math.sin(θ)) + Math.abs(hd * Math.cos(θ)),
  };
}

export function checkOutOfBounds(item: FurnitureItem, room: RoomConfig): boolean {
  const { halfW, halfD } = getRotatedAABBHalfExtents(item.dimensions, item.rotation);
  const rHW = room.width / 2;
  const rHD = room.depth / 2;
  return (
    item.position.x - halfW < -rHW ||
    item.position.x + halfW > rHW ||
    item.position.z - halfD < -rHD ||
    item.position.z + halfD > rHD
  );
}

export function clampToRoom(
  x: number,
  z: number,
  dims: FurnitureDimensions,
  rotation: number,
  room: RoomConfig
): { x: number; z: number } {
  const { halfW, halfD } = getRotatedAABBHalfExtents(dims, rotation);
  const rHW = room.width / 2;
  const rHD = room.depth / 2;
  return {
    x: Math.max(-rHW + halfW, Math.min(rHW - halfW, x)),
    z: Math.max(-rHD + halfD, Math.min(rHD - halfD, z)),
  };
}

export function computeAnalytics(furniture: FurnitureItem[], room: RoomConfig): SpaceAnalytics {
  const roomArea = room.width * room.depth;
  const occupiedArea = furniture.reduce((sum, f) => {
    return sum + f.dimensions.width * f.dimensions.depth;
  }, 0);
  const freeArea = Math.max(0, roomArea - occupiedArea);
  const fillPercent = roomArea > 0 ? Math.min(100, (occupiedArea / roomArea) * 100) : 0;

  const corridorWarnings: CorridorWarning[] = [];
  for (let i = 0; i < furniture.length; i++) {
    for (let j = i + 1; j < furniture.length; j++) {
      const a = furniture[i];
      const b = furniture[j];

      const aMinX = a.position.x - a.dimensions.width / 2;
      const aMaxX = a.position.x + a.dimensions.width / 2;
      const aMinZ = a.position.z - a.dimensions.depth / 2;
      const aMaxZ = a.position.z + a.dimensions.depth / 2;

      const bMinX = b.position.x - b.dimensions.width / 2;
      const bMaxX = b.position.x + b.dimensions.width / 2;
      const bMinZ = b.position.z - b.dimensions.depth / 2;
      const bMaxZ = b.position.z + b.dimensions.depth / 2;

      const xGap = Math.max(0, Math.max(aMinX, bMinX) - Math.min(aMaxX, bMaxX));
      const zGap = Math.max(0, Math.max(aMinZ, bMinZ) - Math.min(aMaxZ, bMaxZ));
      const dist = Math.sqrt(xGap ** 2 + zGap ** 2);

      if (dist > 0 && dist < 0.6) {
        corridorWarnings.push({ item1Id: a.id, item2Id: b.id, distance: dist });
      }
    }
  }

  return {
    roomArea,
    occupiedArea,
    freeArea,
    fillPercent,
    objectCount: furniture.length,
    corridorWarnings,
  };
}

export function getRecommendation(analytics: SpaceAnalytics, lang: 'ru' | 'en'): string {
  const { fillPercent, objectCount } = analytics;
  const recs = lang === 'ru'
    ? {
        empty: 'Начните добавлять мебель в пространство',
        tooEmpty: 'Комната выглядит свободно — можно добавить больше мебели',
        balanced: 'Планировка сбалансирована ✓',
        crowded: 'Проверьте проходы — комната заполнена',
        overloaded: 'Слишком много мебели для этой площади',
      }
    : {
        empty: 'Start adding furniture to the space',
        tooEmpty: 'The room looks spacious — you can add more furniture',
        balanced: 'The layout is balanced ✓',
        crowded: 'Check passageways — room is getting full',
        overloaded: 'Too much furniture for this room size',
      };

  if (objectCount === 0) return recs.empty;
  if (fillPercent < 15) return recs.tooEmpty;
  if (fillPercent < 45) return recs.balanced;
  if (fillPercent < 70) return recs.crowded;
  return recs.overloaded;
}

export function formatArea(area: number): string {
  return area.toFixed(1);
}

export function formatDimension(val: number): string {
  return val.toFixed(2);
}
