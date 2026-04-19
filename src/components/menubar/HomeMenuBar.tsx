import * as React from 'react';

interface HomeMenuBarProps {
  onToggleTheme: () => void;
  theme: string;
}

const HomeMenuBar: React.FC<HomeMenuBarProps> = ({ onToggleTheme, theme }) => {
  return (
    <button
      className="absolute top-8 right-8 z-20 px-4 py-2 rounded-xl bg-white/80 text-slate-800 font-bold shadow hover:bg-white"
      onClick={onToggleTheme}
      aria-label="Tema Değiştir"
    >
      {theme === 'dark' ? '☀️ Aydınlık' : '🌙 Karanlık'}
    </button>
  );
};

export default HomeMenuBar;

