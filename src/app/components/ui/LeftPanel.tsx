import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Armchair,
  Bed,
  Table2,
  Package,
  Minus,
  Plus,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  Camera,
} from 'lucide-react';

import { useStore } from '../../store/useStore';
import { t } from '../../lib/localization';
import type { FurnitureType, CameraMode } from '../../types';
import { ObjectCatalogPanel } from './ObjectCatalogPanel';
import { OpeningsPanel } from './OpeningsPanel';

const FURNITURE_ICONS: Record<FurnitureType, React.ReactNode> = {
  wardrobe: <Package size={18} strokeWidth={1.8} />,
  sofa: <Armchair size={18} strokeWidth={1.8} />,
  bed: <Bed size={18} strokeWidth={1.8} />,
  table: <Table2 size={18} strokeWidth={1.8} />,
  dresser: <LayoutDashboard size={18} strokeWidth={1.8} />,
  nightstand: <Package size={16} strokeWidth={1.8} />,
};

const FURNITURE_TYPES: FurnitureType[] = [
  'wardrobe',
  'sofa',
  'bed',
  'table',
  'dresser',
  'nightstand',
];

const FURNITURE_COLORS: Record<FurnitureType, string> = {
  wardrobe: '#C4956A',
  sofa: '#8B7355',
  bed: '#DDB891',
  table: '#A0785A',
  dresser: '#C4956A',
  nightstand: '#A8917A',
};

export function LeftPanel() {
  const language = useStore((s) => s.language);
  const room = useStore((s) => s.room);
  const setRoom = useStore((s) => s.setRoom);
  const addFurniture = useStore((s) => s.addFurniture);
  const cameraMode = useStore((s) => s.cameraMode);
  const setCameraMode = useStore((s) => s.setCameraMode);
  const showNotification = useStore((s) => s.showNotification);

  const addAddonObject = useStore((s) => s.addAddonObject);
  const openings = useStore((s) => s.openings);
  const setOpenings = useStore((s) => s.setOpenings);

  const tx = t(language);

  const [roomOpen, setRoomOpen] = useState(true);
  const [catalogOpen, setCatalogOpen] = useState(true);
  const [objectsOpen, setObjectsOpen] = useState(true);
  const [openingsOpen, setOpeningsOpen] = useState(false);

  const handleAdd = (type: FurnitureType) => {
    addFurniture(type);
    showNotification(`${tx.furniture.types[type]} ${tx.furniture.added}`, 'success');
  };

  return (
    <aside
      className="left-panel-scroll flex flex-col gap-3 p-3"
      style={{
        width: 292,
        minWidth: 292,
        height: 'calc(100vh - 72px)',
        maxHeight: 'calc(100vh - 72px)',
        overflowY: 'auto',
        overflowX: 'hidden',
        background: 'rgba(250, 249, 247, 0.96)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(139, 111, 71, 0.12)',
      }}
    >
      <div
        className="sticky top-0 z-20 flex rounded-xl overflow-hidden p-0.5"
        style={{
          background: 'rgba(250, 249, 247, 0.96)',
          border: '1px solid rgba(139,111,71,0.12)',
          boxShadow: '0 8px 18px rgba(139,111,71,0.08)',
        }}
      >
        {(['3d', 'top'] as CameraMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setCameraMode(mode)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs transition-all"
            style={{
              background: cameraMode === mode ? '#8B6F47' : 'transparent',
              color: cameraMode === mode ? 'white' : '#9B8E7E',
              fontWeight: cameraMode === mode ? 700 : 500,
            }}
          >
            <Camera size={13} strokeWidth={2} />
            {mode === '3d' ? tx.camera.view3d : tx.camera.viewTop}
          </button>
        ))}
      </div>

      <PanelSection
        title={tx.room.title}
        open={roomOpen}
        onToggle={() => setRoomOpen(!roomOpen)}
      >
        <div className="flex flex-col gap-2">
          <DimensionInput
            label={`${tx.room.width} (${tx.room.unit})`}
            value={room.width}
            min={2}
            max={20}
            onChange={(v) => setRoom({ width: v })}
          />

          <DimensionInput
            label={`${tx.room.depth} (${tx.room.unit})`}
            value={room.depth}
            min={2}
            max={20}
            onChange={(v) => setRoom({ depth: v })}
          />

          <DimensionInput
            label={`${tx.room.height} (${tx.room.unit})`}
            value={room.height}
            min={2}
            max={5}
            step={0.1}
            onChange={(v) => setRoom({ height: v })}
          />
        </div>

        <div
          className="mt-2 px-3 py-2 rounded-lg text-xs flex items-center justify-between"
          style={{
            background: 'rgba(139, 111, 71, 0.08)',
            color: '#8B6F47',
          }}
        >
          <span style={{ fontWeight: 500 }}>{tx.analytics.roomArea}</span>
          <span style={{ fontWeight: 700 }}>
            {(room.width * room.depth).toFixed(1)} {tx.analytics.sqm}
          </span>
        </div>
      </PanelSection>

      <PanelSection
        title={tx.furniture.catalog}
        open={catalogOpen}
        onToggle={() => setCatalogOpen(!catalogOpen)}
      >
        <div className="flex flex-col gap-1.5">
          {FURNITURE_TYPES.map((type) => (
            <FurnitureCatalogItem
              key={type}
              name={tx.furniture.types[type]}
              description={tx.furniture.descriptions[type]}
              color={FURNITURE_COLORS[type]}
              icon={FURNITURE_ICONS[type]}
              onAdd={() => handleAdd(type)}
              addLabel={tx.furniture.add}
            />
          ))}
        </div>
      </PanelSection>

      <PanelSection
        title="Каталог предметов"
        open={objectsOpen}
        onToggle={() => setObjectsOpen(!objectsOpen)}
      >
        <div
          className="max-h-[420px] overflow-y-auto pr-1"
          style={{
            scrollbarWidth: 'thin',
          }}
        >
          <ObjectCatalogPanel language={language} onAddObject={addAddonObject} />
        </div>
      </PanelSection>

      <PanelSection
        title="Окна и двери"
        open={openingsOpen}
        onToggle={() => setOpeningsOpen(!openingsOpen)}
      >
        <div
          className="max-h-[420px] overflow-y-auto pr-1"
          style={{
            scrollbarWidth: 'thin',
          }}
        >
          <OpeningsPanel
            room={room}
            openings={openings}
            language={language}
            onChange={setOpenings}
          />
        </div>
      </PanelSection>

      <div style={{ minHeight: 18 }} />
    </aside>
  );
}

interface PanelSectionProps {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function PanelSection({ title, open, onToggle, children }: PanelSectionProps) {
  return (
    <div
      className="rounded-xl overflow-hidden shrink-0"
      style={{
        background: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid rgba(139, 111, 71, 0.12)',
        boxShadow: '0 6px 18px rgba(139, 111, 71, 0.06)',
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <span
          className="text-xs"
          style={{
            fontWeight: 700,
            color: '#5C4F3E',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          {title}
        </span>

        {open ? (
          <ChevronUp size={14} color="#9B8E7E" />
        ) : (
          <ChevronDown size={14} color="#9B8E7E" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-3 pb-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface DimensionInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}

function DimensionInput({
  label,
  value,
  min,
  max,
  step = 0.1,
  onChange,
}: DimensionInputProps) {
  const handleChange = (delta: number) => {
    const next = Math.round((value + delta) * 10) / 10;
    onChange(Math.max(min, Math.min(max, next)));
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);

    if (!Number.isNaN(v)) {
      onChange(Math.max(min, Math.min(max, v)));
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className="text-xs flex-1"
        style={{ color: '#7A6E64', fontWeight: 500 }}
      >
        {label}
      </span>

      <div
        className="flex items-center rounded-lg overflow-hidden"
        style={{
          border: '1px solid rgba(139, 111, 71, 0.2)',
          background: '#FAF9F7',
        }}
      >
        <button
          onClick={() => handleChange(-step)}
          className="w-7 h-7 flex items-center justify-center transition-all hover:opacity-70"
          style={{ color: '#8B6F47' }}
        >
          <Minus size={12} strokeWidth={2.5} />
        </button>

        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={handleInput}
          className="w-12 text-center text-xs bg-transparent outline-none"
          style={{ color: '#1A1714', fontWeight: 600 }}
        />

        <button
          onClick={() => handleChange(step)}
          className="w-7 h-7 flex items-center justify-center transition-all hover:opacity-70"
          style={{ color: '#8B6F47' }}
        >
          <Plus size={12} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

interface FurnitureCatalogItemProps {
  name: string;
  description: string;
  color: string;
  icon: React.ReactNode;
  onAdd: () => void;
  addLabel: string;
}

function FurnitureCatalogItem({
  name,
  description,
  color,
  icon,
  onAdd,
  addLabel,
}: FurnitureCatalogItemProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer group"
      style={{
        background: 'rgba(250, 249, 247, 0.92)',
        border: '1px solid rgba(139, 111, 71, 0.1)',
        transition: 'all 0.15s ease',
      }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: color, color: 'white', opacity: 0.9 }}
      >
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-xs truncate" style={{ fontWeight: 700, color: '#1A1714' }}>
          {name}
        </div>
        <div className="text-xs truncate" style={{ color: '#9B8E7E', fontWeight: 400 }}>
          {description}
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.93 }}
        onClick={onAdd}
        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: '#8B6F47', color: 'white' }}
        title={addLabel}
      >
        <Plus size={14} strokeWidth={2.5} />
      </motion.button>
    </motion.div>
  );
}