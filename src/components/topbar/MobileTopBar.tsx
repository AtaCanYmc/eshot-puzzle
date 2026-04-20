import * as React from 'react';

interface MobileTopBarProps {
  theme: string;
  toggleTheme: () => void;
  steps: number;
  onExit: () => void;
  setSidebarOpen: (open: boolean) => void;
}

const MobileTopBar: React.FC<MobileTopBarProps> = ({ theme, toggleTheme, steps, onExit, setSidebarOpen }) => {
  return (
    <nav className={`fixed top-0 left-0 w-full h-14 flex items-center justify-between px-4 z-[1000] bg-white/90 ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-black text-lg shadow">E</div>
        <span className="font-black text-base tracking-tight">ESHOT</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-primary">{steps} adım</span>
        <button
          onClick={toggleTheme}
          className={`px-2 py-1 rounded-lg font-bold text-base transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/40
            ${theme === 'dark' ? 'text-slate-200 hover:bg-slate-800/30' : 'text-slate-700 hover:bg-slate-200/60'}`}
          aria-label="Tema Değiştir"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <button
          onClick={onExit}
          className="px-2 py-1 rounded-lg font-bold text-xs flex items-center gap-1 text-red-500 hover:bg-red-500/10 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-400/40"
          aria-label="Geri Dön"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
      </div>
    </nav>
  );
};

export default MobileTopBar;
