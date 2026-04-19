import * as React from 'react';

interface GameTopBarProps {
  theme: string;
  toggleTheme: () => void;
  steps: number;
  onExit: () => void;
}

const GameTopBar: React.FC<GameTopBarProps> = ({ theme, toggleTheme, steps, onExit }) => {
  return (
    <nav className={`h-16 flex items-center justify-between px-6 glass z-[1000] border-b shrink-0 transition-colors duration-300
      ${theme === 'dark' ? 'border-white/10 bg-slate-950' : 'border-slate-200 bg-white'}`}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-black text-xl shadow-lg shadow-primary/20">E</div>
        <div>
          <h1 className={`font-black tracking-tighter text-lg leading-none ${theme === 'dark' ? '' : 'text-slate-900'}`}>ESHOT PUZZLE</h1>
          <p className={`text-[10px] uppercase tracking-widest font-bold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Aktarma Simülasyonu</p>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <div className="flex flex-col items-center">
          <span className={`text-[10px] uppercase font-black tracking-tighter ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>ADIMLAR</span>
          <span className="text-xl font-black text-primary leading-none">{steps}</span>
        </div>
        {/* Tema Değiştir Butonu */}
        <button
          onClick={toggleTheme}
          className={`px-4 py-2 rounded-xl font-bold shadow transition-colors duration-200 aria-label:tema-degistir
            ${theme === 'dark' ? 'bg-white/80 text-slate-800 hover:bg-white' : 'bg-slate-200 text-slate-900 hover:bg-slate-300'}`}
          aria-label="Tema Değiştir"
        >
          {theme === 'dark' ? '☀️ Aydınlık' : '🌙 Karanlık'}
        </button>
        <button
          onClick={onExit}
          className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold text-sm transition-all"
        >
          ÇIKIŞ
        </button>
      </div>
    </nav>
  );
};

export default GameTopBar;

