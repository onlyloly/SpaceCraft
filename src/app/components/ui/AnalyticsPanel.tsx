import { useMemo } from 'react';
import { motion } from 'motion/react';
import { BarChart3, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { t } from '../../lib/localization';
import { computeAnalytics, getRecommendation, formatArea } from '../../lib/utils';

export function AnalyticsPanel() {
  const language = useStore((s) => s.language);
  const room = useStore((s) => s.room);
  const furniture = useStore((s) => s.furniture);
  const tx = t(language);

  const analytics = useMemo(() => computeAnalytics(furniture, room), [furniture, room]);
  const recommendation = useMemo(
    () => getRecommendation(analytics, language),
    [analytics, language]
  );

  const fillColor =
    analytics.fillPercent < 30
      ? '#4B7C59'
      : analytics.fillPercent < 60
      ? '#8B6F47'
      : analytics.fillPercent < 80
      ? '#D4892A'
      : '#C44B4B';

  return (
    <div
      className="mx-3 mb-3 rounded-xl overflow-hidden"
      style={{
        background: 'rgba(255, 255, 255, 0.85)',
        border: '1px solid rgba(139, 111, 71, 0.12)',
        boxShadow: '0 1px 3px rgba(139, 111, 71, 0.06)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ borderBottom: '1px solid rgba(139,111,71,0.08)' }}
      >
        <BarChart3 size={14} color="#8B6F47" strokeWidth={2} />
        <span
          className="text-xs"
          style={{ fontWeight: 600, color: '#5C4F3E', letterSpacing: '0.04em', textTransform: 'uppercase' }}
        >
          {tx.analytics.title}
        </span>
      </div>

      <div className="px-4 py-3 flex flex-col gap-3">
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2">
          <StatTile
            label={tx.analytics.roomArea}
            value={`${formatArea(analytics.roomArea)} ${tx.analytics.sqm}`}
          />
          <StatTile
            label={tx.analytics.objects}
            value={`${analytics.objectCount} ${tx.analytics.pcs}`}
          />
          <StatTile
            label={tx.analytics.occupied}
            value={`${formatArea(analytics.occupiedArea)} ${tx.analytics.sqm}`}
            highlight
          />
          <StatTile
            label={tx.analytics.free}
            value={`${formatArea(analytics.freeArea)} ${tx.analytics.sqm}`}
          />
        </div>

        {/* Fill rate bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs" style={{ color: '#9B8E7E', fontWeight: 500 }}>
              {tx.analytics.fillRate}
            </span>
            <span className="text-xs" style={{ color: fillColor, fontWeight: 700 }}>
              {analytics.fillPercent.toFixed(0)}%
            </span>
          </div>
          <div
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ background: 'rgba(139, 111, 71, 0.1)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: fillColor }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, analytics.fillPercent)}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Recommendation */}
        <div
          className="flex items-start gap-2 px-3 py-2.5 rounded-xl"
          style={{
            background: analytics.fillPercent > 70 ? 'rgba(212, 137, 42, 0.08)' : 'rgba(75, 124, 89, 0.07)',
            border: `1px solid ${analytics.fillPercent > 70 ? 'rgba(212, 137, 42, 0.2)' : 'rgba(75, 124, 89, 0.15)'}`,
          }}
        >
          <TrendingUp
            size={13}
            color={analytics.fillPercent > 70 ? '#D4892A' : '#4B7C59'}
            style={{ marginTop: 1, flexShrink: 0 }}
          />
          <p className="text-xs" style={{ color: '#5C4F3E', fontWeight: 500, lineHeight: 1.45 }}>
            {recommendation}
          </p>
        </div>

        {/* Corridor warnings */}
        {analytics.corridorWarnings.length > 0 ? (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <AlertTriangle size={12} color="#D4892A" />
              <span className="text-xs" style={{ color: '#D4892A', fontWeight: 600 }}>
                {tx.analytics.corridorWarnings}: {analytics.corridorWarnings.length}
              </span>
            </div>
            <p className="text-xs" style={{ color: '#9B8E7E', lineHeight: 1.45 }}>
              {tx.warnings.narrowCorridor}
            </p>
          </div>
        ) : analytics.objectCount > 1 ? (
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={12} color="#4B7C59" />
            <span className="text-xs" style={{ color: '#4B7C59', fontWeight: 500 }}>
              {tx.analytics.noWarnings}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function StatTile({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className="rounded-xl px-3 py-2.5"
      style={{
        background: highlight ? 'rgba(139, 111, 71, 0.07)' : '#FAF9F7',
        border: `1px solid ${highlight ? 'rgba(139,111,71,0.18)' : 'rgba(139,111,71,0.08)'}`,
      }}
    >
      <div className="text-xs" style={{ color: '#9B8E7E', fontWeight: 400 }}>
        {label}
      </div>
      <div className="text-sm mt-0.5" style={{ color: '#1A1714', fontWeight: 700 }}>
        {value}
      </div>
    </div>
  );
}
