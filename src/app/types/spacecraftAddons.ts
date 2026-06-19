export type AddonObjectType = 'tableLamp' | 'floorLamp' | 'floorMirror' | 'chair' | 'officeChair' | 'laptop' | 'monitor' | 'plant' | 'rug' | 'books' | 'tv' | 'keyboard' | 'speakers';
export type OpeningType = 'window' | 'door';
export type WallSide = 'back' | 'front' | 'left' | 'right';

export interface AddonDimensions { width: number; depth: number; height: number; }

export interface AddonObjectItem {
  id: string;
  type: AddonObjectType;
  name: string;
  position: { x: number; z: number };
  rotation: number;
  dimensions: AddonDimensions;
  color: string;
  outOfBounds?: boolean;
}

export interface ArchitecturalOpening {
  id: string;
  type: OpeningType;
  wall: WallSide;
  offset: number;
  width: number;
  height: number;
  heightFromFloor: number;
  color: string;
  glassColor?: string;
  openDirection?: 'left' | 'right';
}

export interface RoomSizeForOpenings { width: number; depth: number; height: number; }
