import * as React from 'react';

interface MobilMenuBarProps {
  onToggleTheme: () => void;
  theme: string;
}

const MobilMenuBar: React.FC<MobilMenuBarProps> = ({ onToggleTheme, theme }) => {
  return (
    <div className="fixed bottom-0 left-0 w-full z-50 flex items-center justify-between px-6 py-3 bg-white/90 border-t border-slate-200 shadow-lg">
      <span className="font-black text-primary text-lg">ESHOT</span>
      <button
        className="px-4 py-2 rounded-xl bg-primary text-white font-bold shadow hover:bg-primary-dark"
        onClick={onToggleTheme}
        aria-label="Tema Değiştir"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </div>
  );
};

export default MobilMenuBar;

