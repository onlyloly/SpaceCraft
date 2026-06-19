import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  FurnitureItem,
  FurnitureType,
  RoomConfig,
  ProjectData,
  CameraMode,
  Language,
} from '../types';
import type {
  AddonObjectItem,
  AddonObjectType,
  ArchitecturalOpening,
} from '../types/spacecraftAddons';
import {
  generateId,
  DEFAULT_DIMENSIONS,
  DEFAULT_COLORS,
  checkOutOfBounds,
  clampToRoom,
} from '../lib/utils';
import { t } from '../lib/localization';
import { getObjectCatalogItem } from '../data/objectCatalog';

interface AppStore {
  language: Language;
  setLanguage: (lang: Language) => void;

  room: RoomConfig;
  setRoom: (updates: Partial<RoomConfig>) => void;

  furniture: FurnitureItem[];
  addFurniture: (type: FurnitureType) => void;
  removeFurniture: (id: string) => void;
  updateFurniture: (id: string, updates: Partial<Omit<FurnitureItem, 'id' | 'type'>>) => void;
  moveFurniture: (id: string, x: number, z: number) => void;

  addonObjects: AddonObjectItem[];
  addAddonObject: (type: AddonObjectType) => void;
  updateAddonObject: (id: string, updates: Partial<AddonObjectItem>) => void;
  removeAddonObject: (id: string) => void;

  openings: ArchitecturalOpening[];
  setOpenings: (openings: ArchitecturalOpening[]) => void;

  selectedId: string | null;
  selectFurniture: (id: string | null) => void;

  cameraMode: CameraMode;
  setCameraMode: (mode: CameraMode) => void;

  notification: { message: string; type: 'success' | 'warning' | 'error' } | null;
  showNotification: (message: string, type?: 'success' | 'warning' | 'error') => void;
  clearNotification: () => void;

  projectName: string;
  setProjectName: (name: string) => void;

  saveProject: () => void;
  resetProject: () => void;
  exportProject: () => void;
  importProject: (data: ProjectData) => void;
}

const DEFAULT_ROOM: RoomConfig = { width: 5, depth: 4, height: 2.7 };

function recalcBounds(items: FurnitureItem[], room: RoomConfig): FurnitureItem[] {
  return items.map((item) => ({
    ...item,
    outOfBounds: checkOutOfBounds(item, room),
  }));
}

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      language: 'ru',
      setLanguage: (lang) => set({ language: lang }),

      room: DEFAULT_ROOM,
      setRoom: (updates) => {
        const newRoom = { ...get().room, ...updates };
        const furniture = recalcBounds(get().furniture, newRoom);
        set({ room: newRoom, furniture });
      },

      furniture: [],
      addFurniture: (type) => {
        const { language } = get();
        const dims = { ...DEFAULT_DIMENSIONS[type] };
        const name = t(language).furniture.types[type];

        const newItem: FurnitureItem = {
          id: generateId(),
          type,
          name,
          position: { x: 0, z: 0 },
          rotation: 0,
          dimensions: dims,
          color: DEFAULT_COLORS[type],
          outOfBounds: false,
        };

        set((s) => ({ furniture: [...s.furniture, newItem] }));
      },

      removeFurniture: (id) => {
        set((s) => ({
          furniture: s.furniture.filter((f) => f.id !== id),
          selectedId: s.selectedId === id ? null : s.selectedId,
        }));
      },

      updateFurniture: (id, updates) => {
        const { room } = get();
        set((s) => ({
          furniture: recalcBounds(
            s.furniture.map((f) => (f.id === id ? { ...f, ...updates } : f)),
            room
          ),
        }));
      },

      moveFurniture: (id, x, z) => {
        const { room, furniture } = get();
        const item = furniture.find((f) => f.id === id);
        if (!item) return;

        const clamped = clampToRoom(x, z, item.dimensions, item.rotation, room);

        set((s) => ({
          furniture: s.furniture.map((f) =>
            f.id === id
              ? {
                  ...f,
                  position: clamped,
                  outOfBounds: checkOutOfBounds({ ...f, position: clamped }, room),
                }
              : f
          ),
        }));
      },

      addonObjects: [],

      addAddonObject: (type) => {
  const { room } = get();

  const catalogItem = getObjectCatalogItem(type);
  if (!catalogItem) return;

        const newItem: AddonObjectItem = {
          id: `${type}-${Date.now().toString(36)}-${Math.random()
            .toString(36)
            .slice(2, 8)}`,
          type,
          name: catalogItem.nameRu,
          position: {
  x: Math.max(-room.width / 2 + 0.5, Math.min(room.width / 2 - 0.5, 0.8)),
  z: Math.max(-room.depth / 2 + 0.5, Math.min(room.depth / 2 - 0.5, 0.8)),
},
          rotation: 0,
          dimensions: { ...catalogItem.dimensions },
          color: catalogItem.color,
          outOfBounds: false,
        };

        set((s) => ({
          addonObjects: [...s.addonObjects, newItem],
        }));

        get().showNotification(`${catalogItem.nameRu} добавлен(а) в сцену`, 'success');
      },

      updateAddonObject: (id, updates) => {
        set((s) => ({
          addonObjects: s.addonObjects.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }));
      },

      removeAddonObject: (id) => {
        set((s) => ({
          addonObjects: s.addonObjects.filter((item) => item.id !== id),
        }));
      },

      openings: [],

      setOpenings: (openings) => {
        set({ openings });
      },

      selectedId: null,
      selectFurniture: (id) => set({ selectedId: id }),

      cameraMode: '3d',
      setCameraMode: (mode) => set({ cameraMode: mode }),

      notification: null,
      showNotification: (message, type = 'success') => {
        set({ notification: { message, type } });
        setTimeout(() => set({ notification: null }), 3000);
      },
      clearNotification: () => set({ notification: null }),

      projectName: 'Мой проект',
      setProjectName: (name) => set({ projectName: name }),

      saveProject: () => {
        const { showNotification, language } = get();
        showNotification(t(language).actions.saveSuccess, 'success');
      },

      resetProject: () => {
        const { language } = get();

        set({
          furniture: [],
          addonObjects: [],
          openings: [],
          selectedId: null,
          room: DEFAULT_ROOM,
          projectName: t(language).header.projectName,
        });

        get().showNotification(t(language).actions.resetSuccess, 'success');
      },

      exportProject: () => {
        const {
          room,
          furniture,
          addonObjects,
          openings,
          projectName,
          language,
        } = get();

        const data = {
          room,
          furniture,
          addonObjects,
          openings,
          projectName,
          language,
          savedAt: new Date().toISOString(),
          version: '1.1.0',
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: 'application/json',
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${projectName.replace(/\s+/g, '_')}_spacecraft.json`;
        a.click();
        URL.revokeObjectURL(url);

        get().showNotification(t(language).actions.exportSuccess, 'success');
      },

      importProject: (data: any) => {
        const { language } = get();

        set({
          room: data.room,
          furniture: data.furniture ?? [],
          addonObjects: data.addonObjects ?? [],
          openings: data.openings ?? [],
          projectName: data.projectName,
          selectedId: null,
        });

        get().showNotification(t(language).actions.importSuccess, 'success');
      },
    }),
    {
      name: 'spacecraft-project-v1',
      partialize: (state) => ({
        room: state.room,
        furniture: state.furniture,
        addonObjects: state.addonObjects,
        openings: state.openings,
        projectName: state.projectName,
        language: state.language,
        cameraMode: state.cameraMode,
      }),
    }
  )
);