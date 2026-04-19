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
    <nav className={`fixed top-0 left-0 w-full h-14 flex items-center justify-between px-4 z-[1000] shadow bg-white/90 border-b border-slate-200 ${theme === 'dark' ? 'bg-slate-900 text-white border-white/10' : 'bg-white text-slate-900 border-slate-200'}`}>
      <div className="flex items-center gap-2">
        <button
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200/50"
          onClick={() => setSidebarOpen(true)}
          aria-label="Menüyü Aç"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-black text-lg shadow">E</div>
        <span className="font-black text-base tracking-tight">ESHOT</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-primary">{steps} adım</span>
        <button
          onClick={toggleTheme}
          className={`px-2 py-1 rounded-lg font-bold shadow aria-label:tema-degistir text-base
            ${theme === 'dark' ? 'bg-white/80 text-slate-800' : 'bg-slate-200 text-slate-900'}`}
          aria-label="Tema Değiştir"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <button
          onClick={onExit}
          className="px-2 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold text-xs"
        >
          Çıkış
        </button>
      </div>
    </nav>
  );
};

export default MobileTopBar;
