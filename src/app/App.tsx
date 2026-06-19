/* MARKER-MAKE-KIT-INVOKED */
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/ui/Header';
import { LeftPanel } from './components/ui/LeftPanel';
import { RightPanel } from './components/ui/RightPanel';
import { Scene3D } from './components/scene/Scene3D';
import { useStore } from './store/useStore';
import { t } from './lib/localization';

export default function App() {
  const notification = useStore((s) => s.notification);
  const language = useStore((s) => s.language);
  const furniture = useStore((s) => s.furniture);
  const tx = t(language);

  return (
    <div
      className="flex flex-col"
      style={{
        width: '100vw',
        height: '100vh',
        background: '#71624c',
        fontFamily: "'Inter', sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Header />

      {/* Main 3-column layout */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left panel */}
        <LeftPanel />

        {/* Center — 3D Scene */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          <Scene3D />

          {/* Bottom overlay — analytics (only visible when furniture exists) */}
          <AnimatePresence>
            {furniture.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-0 left-0 right-0 pointer-events-none"
                style={{ zIndex: 10 }}
              >
                <div className="p-3 pointer-events-auto">
                  <AnalyticsStrip tx={tx} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty state */}
          <AnimatePresence>
            {furniture.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-end justify-center pointer-events-none"
                style={{ paddingBottom: '10%' }}
              >
                <div
                  className="px-5 py-3 rounded-2xl text-center"
                  style={{
                    background: 'rgba(250, 249, 247, 0.88)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(139, 111, 71, 0.2)',
                    boxShadow: '0 4px 24px rgba(139, 111, 71, 0.12)',
                  }}
                >
                  <p className="text-sm" style={{ color: '#5C4F3E', fontWeight: 600 }}>
                    {language === 'ru' ? 'Добавьте мебель из каталога слева' : 'Add furniture from the catalog on the left'}
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#9B8E7E' }}>
                    {language === 'ru' ? 'Перетаскивайте объекты прямо в 3D-пространстве' : 'Drag objects directly in 3D space'}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right panel */}
        <RightPanel />
      </div>

    </div>
  );
}

function AnalyticsStrip({ tx }: { tx: ReturnType<typeof t> }) {
  const furniture = useStore((s) => s.furniture);
  const room = useStore((s) => s.room);
  const occupiedArea = furniture.reduce((s, f) => s + f.dimensions.width * f.dimensions.depth, 0);
  const roomArea = room.width * room.depth;
  const fill = Math.min(100, (occupiedArea / roomArea) * 100);
  const outOfBoundsCount = furniture.filter((f) => f.outOfBounds).length;

  return (
    <div
      className="flex items-center gap-4 px-4 py-2.5 rounded-xl"
      style={{
        background: 'rgba(250, 249, 247, 0.92)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(139, 111, 71, 0.15)',
        boxShadow: '0 4px 20px rgba(139, 111, 71, 0.1)',
      }}
    >
      <StripStat label={tx.analytics.objects} value={`${furniture.length} ${tx.analytics.pcs}`} />
      <StripDivider />
      <StripStat label={tx.analytics.roomArea} value={`${roomArea.toFixed(1)} ${tx.analytics.sqm}`} />
      <StripDivider />
      <StripStat
        label={tx.analytics.fillRate}
        value={`${fill.toFixed(0)}%`}
        color={fill > 70 ? '#D4892A' : '#4B7C59'}
      />
      {outOfBoundsCount > 0 && (
        <>
          <StripDivider />
          <div className="flex items-center gap-1.5">
            <span style={{ fontSize: 12, color: '#C44B4B' }}>⚠</span>
            <span className="text-xs" style={{ color: '#C44B4B', fontWeight: 600 }}>
              {outOfBoundsCount} {tx.properties.noSelection.includes('Object') ? 'out of bounds' : 'вне комнаты'}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

function StripStat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs" style={{ color: '#9B8E7E', fontWeight: 400 }}>
        {label}
      </span>
      <span className="text-xs" style={{ color: color ?? '#1A1714', fontWeight: 700 }}>
        {value}
      </span>
    </div>
  );
}

function StripDivider() {
  return <div className="w-px h-3" style={{ background: 'rgba(139, 111, 71, 0.2)' }} />;
}
