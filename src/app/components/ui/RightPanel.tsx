import { motion, AnimatePresence } from 'motion/react';
import { Trash2, RotateCcw, MousePointerClick } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { t } from '../../lib/localization';
import { FURNITURE_PRESETS_COLORS } from '../../lib/utils';
import { AnalyticsPanel } from './AnalyticsPanel';

export function RightPanel() {
  const language = useStore((s) => s.language);
  const selectedId = useStore((s) => s.selectedId);

  const furniture = useStore((s) => s.furniture);
  const addonObjects = useStore((s) => s.addonObjects);

  const updateFurniture = useStore((s) => s.updateFurniture);
  const removeFurniture = useStore((s) => s.removeFurniture);

  const updateAddonObject = useStore((s) => s.updateAddonObject);
  const removeAddonObject = useStore((s) => s.removeAddonObject);

  const selectFurniture = useStore((s) => s.selectFurniture);

  const tx = t(language);

  const selectedFurniture = furniture.find((f) => f.id === selectedId) ?? null;
  const selectedAddon = addonObjects.find((obj) => obj.id === selectedId) ?? null;

  const item = selectedFurniture ?? selectedAddon;
  const selectedType = selectedFurniture ? 'furniture' : selectedAddon ? 'addon' : null;

  const updateSelectedItem = (updates: any) => {
    if (!item || !selectedType) return;

    if (selectedType === 'furniture') {
      updateFurniture(item.id, updates);
    } else {
      updateAddonObject(item.id, updates);
    }
  };

  const removeSelectedItem = () => {
    if (!item || !selectedType) return;

    if (selectedType === 'furniture') {
      removeFurniture(item.id);
    } else {
      removeAddonObject(item.id);
    }

    selectFurniture(null);
  };

  return (
    <aside
      className="flex flex-col overflow-y-auto"
      style={{
        width: 272,
        minWidth: 272,
        background: 'rgba(250, 249, 247, 0.95)',
        backdropFilter: 'blur(20px)',
        borderLeft: '1px solid rgba(139, 111, 71, 0.12)',
      }}
    >
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(139, 111, 71, 0.1)' }}
      >
        <span
          className="text-xs"
          style={{
            fontWeight: 600,
            color: '#5C4F3E',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          {tx.properties.title}
        </span>

        {item && (
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={removeSelectedItem}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs"
            style={{
              background: 'rgba(196, 75, 75, 0.1)',
              color: '#C44B4B',
              fontWeight: 500,
            }}
          >
            <Trash2 size={12} />
            <span>{tx.properties.delete}</span>
          </motion.button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!item ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center flex-1 p-6 text-center"
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
              style={{ background: 'rgba(139, 111, 71, 0.08)' }}
            >
              <MousePointerClick size={22} color="#C4956A" strokeWidth={1.5} />
            </div>

            <p className="text-sm" style={{ fontWeight: 500, color: '#5C4F3E' }}>
              {tx.properties.noSelection}
            </p>

            <p className="text-xs mt-1.5" style={{ color: '#9B8E7E', lineHeight: 1.5 }}>
              {tx.properties.noSelectionHint}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col gap-3 p-3"
          >
            <div
              className="rounded-xl p-3"
              style={{
                background: 'rgba(255,255,255,0.85)',
                border: '1px solid rgba(139,111,71,0.12)',
              }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <Label>{tx.properties.name}</Label>

                <span
                  className="text-[10px] px-2 py-1 rounded-full"
                  style={{
                    background:
                      selectedType === 'addon'
                        ? 'rgba(139,111,71,0.12)'
                        : 'rgba(196,149,106,0.14)',
                    color: '#8B6F47',
                    fontWeight: 700,
                  }}
                >
                  {selectedType === 'addon' ? 'Предмет' : 'Мебель'}
                </span>
              </div>

              <input
                value={item.name}
                onChange={(e) => updateSelectedItem({ name: e.target.value })}
                className="w-full text-sm rounded-lg px-3 py-2 outline-none"
                style={{
                  background: '#FAF9F7',
                  border: '1px solid rgba(139, 111, 71, 0.2)',
                  color: '#1A1714',
                  fontWeight: 500,
                }}
              />
            </div>

            <PropertyCard title={tx.properties.dimensions}>
              <NumberField
                label={`${tx.properties.width} (м)`}
                value={item.dimensions.width}
                min={0.03}
                max={10}
                step={0.05}
                onChange={(v) =>
                  updateSelectedItem({
                    dimensions: { ...item.dimensions, width: v },
                  })
                }
              />

              <NumberField
                label={`${tx.properties.depth} (м)`}
                value={item.dimensions.depth}
                min={0.03}
                max={10}
                step={0.05}
                onChange={(v) =>
                  updateSelectedItem({
                    dimensions: { ...item.dimensions, depth: v },
                  })
                }
              />

              <NumberField
                label={`${tx.properties.height} (м)`}
                value={item.dimensions.height}
                min={0.02}
                max={4}
                step={0.05}
                onChange={(v) =>
                  updateSelectedItem({
                    dimensions: { ...item.dimensions, height: v },
                  })
                }
              />
            </PropertyCard>

            <PropertyCard title={tx.properties.position}>
              <NumberField
                label={`${tx.properties.positionX} (м)`}
                value={item.position.x}
                min={-20}
                max={20}
                step={0.05}
                onChange={(v) =>
                  updateSelectedItem({
                    position: { ...item.position, x: v },
                  })
                }
              />

              <NumberField
                label={`${tx.properties.positionZ} (м)`}
                value={item.position.z}
                min={-20}
                max={20}
                step={0.05}
                onChange={(v) =>
                  updateSelectedItem({
                    position: { ...item.position, z: v },
                  })
                }
              />

              <div className="flex items-center gap-2 mt-1">
                <Label>{tx.properties.rotation} (°)</Label>

                <input
                  type="range"
                  min={0}
                  max={360}
                  step={5}
                  value={item.rotation}
                  onChange={(e) =>
                    updateSelectedItem({
                      rotation: parseFloat(e.target.value),
                    })
                  }
                  className="flex-1"
                  style={{ accentColor: '#8B6F47' }}
                />

                <span
                  className="text-xs w-8 text-right"
                  style={{ color: '#8B6F47', fontWeight: 600 }}
                >
                  {item.rotation}°
                </span>

                <button
                  onClick={() => updateSelectedItem({ rotation: 0 })}
                  className="w-6 h-6 rounded-md flex items-center justify-center"
                  style={{
                    background: 'rgba(139,111,71,0.1)',
                    color: '#8B6F47',
                  }}
                >
                  <RotateCcw size={11} />
                </button>
              </div>
            </PropertyCard>

            <PropertyCard title={tx.properties.appearance}>
              <Label>{tx.properties.color}</Label>

              <div className="flex flex-wrap gap-1.5 mt-2">
                {FURNITURE_PRESETS_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => updateSelectedItem({ color: c })}
                    className="w-6 h-6 rounded-lg transition-transform hover:scale-110"
                    style={{
                      background: c,
                      border:
                        item.color === c
                          ? '2px solid #8B6F47'
                          : '2px solid transparent',
                      outline: item.color === c ? '1px solid white' : 'none',
                      boxShadow:
                        item.color === c
                          ? '0 0 0 3px rgba(139,111,71,0.3)'
                          : 'none',
                    }}
                    title={c}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input
                  type="color"
                  value={item.color}
                  onChange={(e) => updateSelectedItem({ color: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer"
                  style={{
                    border: '1px solid rgba(139,111,71,0.2)',
                    padding: '2px',
                  }}
                />

                <span
                  className="text-xs"
                  style={{
                    color: '#9B8E7E',
                    fontFamily: 'monospace',
                  }}
                >
                  {item.color.toUpperCase()}
                </span>
              </div>
            </PropertyCard>

            {item.outOfBounds && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs"
                style={{
                  background: 'rgba(196, 75, 75, 0.08)',
                  border: '1px solid rgba(196, 75, 75, 0.25)',
                  color: '#C44B4B',
                }}
              >
                <span style={{ fontSize: 14 }}>⚠️</span>
                <span style={{ fontWeight: 500 }}>{tx.warnings.outOfBounds}</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-auto">
        <AnalyticsPanel />
      </div>
    </aside>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs block" style={{ color: '#9B8E7E', fontWeight: 500 }}>
      {children}
    </span>
  );
}

function PropertyCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-xl p-3 flex flex-col gap-2"
      style={{
        background: 'rgba(255,255,255,0.85)',
        border: '1px solid rgba(139,111,71,0.12)',
      }}
    >
      <span
        className="text-xs"
        style={{
          fontWeight: 600,
          color: '#8B6F47',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}
      >
        {title}
      </span>

      {children}
    </div>
  );
}

interface NumberFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}

function NumberField({
  label,
  value,
  min,
  max,
  step = 0.05,
  onChange,
}: NumberFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);

    if (!Number.isNaN(v)) {
      onChange(Math.max(min, Math.min(max, Math.round(v * 100) / 100)));
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Label>{label}</Label>

      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={handleChange}
        className="ml-auto w-20 text-right text-xs rounded-lg px-2 py-1.5 outline-none"
        style={{
          background: '#FAF9F7',
          border: '1px solid rgba(139, 111, 71, 0.2)',
          color: '#1A1714',
          fontWeight: 600,
        }}
      />
    </div>
  );
}
