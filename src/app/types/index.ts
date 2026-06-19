export type FurnitureType = 'wardrobe' | 'sofa' | 'bed' | 'table' | 'dresser' | 'nightstand';

export type CameraMode = '3d' | 'top';

export type Language = 'ru' | 'en';

export interface FurnitureDimensions {
  width: number;
  depth: number;
  height: number;
}

export interface FurnitureItem {
  id: string;
  type: FurnitureType;
  name: string;
  position: { x: number; z: number };
  rotation: number;
  dimensions: FurnitureDimensions;
  color: string;
  outOfBounds: boolean;
}

export interface RoomConfig {
  width: number;
  depth: number;
  height: number;
}

export interface ProjectData {
  room: RoomConfig;
  furniture: FurnitureItem[];
  projectName: string;
  language: Language;
  savedAt: string;
  version: string;
}

export interface CorridorWarning {
  item1Id: string;
  item2Id: string;
  distance: number;
}

export interface SpaceAnalytics {
  roomArea: number;
  occupiedArea: number;
  freeArea: number;
  fillPercent: number;
  objectCount: number;
  corridorWarnings: CorridorWarning[];
}
