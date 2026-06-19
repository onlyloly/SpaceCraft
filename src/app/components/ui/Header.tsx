import { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Save, Upload, Download, RotateCcw, Satellite } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { t } from '../../lib/localization';
import type { ProjectData } from '../../types';

export function Header() {
  const language = useStore((s) => s.language);
  const setLanguage = useStore((s) => s.setLanguage);
  const saveProject = useStore((s) => s.saveProject);
  const exportProject = useStore((s) => s.exportProject);
  const importProject = useStore((s) => s.importProject);
  const resetProject = useStore((s) => s.resetProject);
  const notification = useStore((s) => s.notification);
  const tx = t(language);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string) as ProjectData;
        importProject(data);
      } catch {
        useStore.getState().showNotification(tx.warnings.importError, 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    if (window.confirm(tx.actions.confirmReset)) {
      resetProject();
    }
  };

  return (
    <header
      className="flex items-center justify-between px-5 h-14 shrink-0 border-b"
      style={{
        background: 'rgba(250, 249, 247, 0.92)',
        backdropFilter: 'blur(20px)',
        borderColor: 'rgba(139, 111, 71, 0.12)',
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #8B6F47 0%, #C4956A 100%)' }}
        >
          <Satellite size={15} color="white" strokeWidth={2} />
        </div>
        <div className="flex items-baseline gap-2">
          <span
            className="tracking-widest text-sm"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              color: '#1A1714',
              letterSpacing: '0.18em',
            }}
          >
            SPACECRAFT
          </span>
          <span
            className="text-xs hidden sm:block"
            style={{ color: '#9B8E7E', fontWeight: 400 }}
          >
            {tx.app.subtitle}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <HeaderButton
          icon={<Save size={15} />}
          label={tx.header.save}
          onClick={saveProject}
          variant="primary"
        />
        <HeaderButton
          icon={<Upload size={15} />}
          label={tx.header.import}
          onClick={handleImport}
        />
        <HeaderButton
          icon={<Download size={15} />}
          label={tx.header.export}
          onClick={exportProject}
        />
        <div
          className="w-px h-5 mx-1"
          style={{ background: 'rgba(139, 111, 71, 0.2)' }}
        />
        <HeaderButton
          icon={<RotateCcw size={15} />}
          label={tx.header.reset}
          onClick={handleReset}
          variant="ghost"
        />
        <div
          className="w-px h-5 mx-1"
          style={{ background: 'rgba(139, 111, 71, 0.2)' }}
        />
        {/* Language switcher */}
        <LanguageSwitcher current={language} onChange={setLanguage} />
      </div>

 {/* Global notification toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            key="global-notification"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 500, damping: 40 }}
            className="fixed bottom-1 left-1/2 -translate-x-1/2 px-5 py-3 rounded-2xl text-sm shadow-2xl flex items-center gap-2"
            style={{
              background:
                notification.type === 'error'
                  ? '#C44B4B'
                  : notification.type === 'warning'
                  ? '#D4892A'
                  : '#4B7C59',
              color: 'white',
              fontWeight: 500,
              zIndex: 1000,
              maxWidth: '90vw',
              boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
            }}
          >
            <span>
              {notification.type === 'error' ? '✕' : notification.type === 'warning' ? '⚠' : '✓'}
            </span>
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileChange}
      />
    </header>
  );
}

interface HeaderButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'ghost';
}

function HeaderButton({ icon, label, onClick, variant = 'default' }: HeaderButtonProps) {
  const styles = {
    default: {
      background: 'rgba(255,255,255,0.8)',
      border: '1px solid rgba(139,111,71,0.18)',
      color: '#5C4F3E',
    },
    primary: {
      background: 'linear-gradient(135deg, #8B6F47 0%, #A0825A 100%)',
      border: '1px solid transparent',
      color: 'white',
    },
    ghost: {
      background: 'transparent',
      border: '1px solid transparent',
      color: '#9B8E7E',
    },
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all"
      style={{ ...styles[variant], fontWeight: 500 }}
    >
      {icon}
      <span className="hidden sm:block">{label}</span>
    </motion.button>
  );
}

function LanguageSwitcher({
  current,
  onChange,
}: {
  current: 'ru' | 'en';
  onChange: (l: 'ru' | 'en') => void;
}) {
  return (
    <div
      className="flex rounded-lg overflow-hidden"
      style={{ border: '1px solid rgba(139,111,71,0.18)' }}
    >
      {(['ru', 'en'] as const).map((lang) => (
        <button
          key={lang}
          onClick={() => onChange(lang)}
          className="px-2.5 py-1.5 text-xs flex items-center gap-1 transition-all"
          style={{
            background: current === lang ? '#8B6F47' : 'rgba(255,255,255,0.8)',
            color: current === lang ? 'white' : '#9B8E7E',
            fontWeight: current === lang ? 600 : 400,
          }}
        >
          <span>{lang === 'ru' ? '🇷🇺' : '🇬🇧'}</span>
          <span className="hidden sm:block">{lang === 'ru' ? 'RU' : 'EN'}</span>
        </button>
      ))}
    </div>
  );
}
