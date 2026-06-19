import type { ArchitecturalOpening, OpeningType, RoomSizeForOpenings, WallSide } from '../types/spacecraftAddons';

export function createOpening(type: OpeningType, room: RoomSizeForOpenings): ArchitecturalOpening {
  return clampOpeningToWall({
    id: `${type}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    wall: 'back',
    offset: 0,
    width: type === 'door' ? 0.9 : Math.min(1.4, room.width - 0.4),
    height: type === 'door' ? 2.05 : 1.1,
    heightFromFloor: type === 'door' ? 0 : 0.9,
    color: type === 'door' ? '#A87954' : '#D7C4A7',
    glassColor: '#AFC8D1',
    openDirection: 'right',
  }, room);
}

export function getWallLength(wall: WallSide, room: RoomSizeForOpenings): number {
  return wall === 'left' || wall === 'right' ? room.depth : room.width;
}

export function clampOpeningToWall(opening: ArchitecturalOpening, room: RoomSizeForOpenings): ArchitecturalOpening {
  const wallLength = getWallLength(opening.wall, room);
  const width = Math.max(0.35, Math.min(opening.width, Math.max(0.45, wallLength - 0.25)));
  const halfWidth = width / 2;
  const minOffset = -wallLength / 2 + halfWidth + 0.08;
  const maxOffset = wallLength / 2 - halfWidth - 0.08;
  const height = Math.max(0.35, Math.min(opening.height, room.height - 0.08));
  const maxHeightFromFloor = Math.max(0, room.height - height - 0.08);
  return { ...opening, width, height, offset: Math.max(minOffset, Math.min(maxOffset, opening.offset)), heightFromFloor: opening.type === 'door' ? 0 : Math.max(0.15, Math.min(maxHeightFromFloor, opening.heightFromFloor)) };
}

export function getOpeningTransform(opening: ArchitecturalOpening, room: RoomSizeForOpenings): { position: [number, number, number]; rotation: [number, number, number] } {
  const y = opening.heightFromFloor + opening.height / 2;
  const eps = 0.012;
  if (opening.wall === 'back') return { position: [opening.offset, y, -room.depth / 2 + eps], rotation: [0, 0, 0] };
  if (opening.wall === 'front') return { position: [-opening.offset, y, room.depth / 2 - eps], rotation: [0, Math.PI, 0] };
  if (opening.wall === 'left') return { position: [-room.width / 2 + eps, y, -opening.offset], rotation: [0, Math.PI / 2, 0] };
  return { position: [room.width / 2 - eps, y, opening.offset], rotation: [0, -Math.PI / 2, 0] };
}

export function getWallLabel(wall: WallSide, language: 'ru' | 'en' = 'ru') {
  const ru = { back: 'Задняя', front: 'Передняя', left: 'Левая', right: 'Правая' };
  const en = { back: 'Back', front: 'Front', left: 'Left', right: 'Right' };
  return language === 'ru' ? ru[wall] : en[wall];
}
