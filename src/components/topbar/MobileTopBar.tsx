import * as React from 'react';

interface MobileTopBarProps {
    theme: string;
    toggleTheme: () => void;
    onExit: () => void;
}

const MobileTopBar: React.FC<MobileTopBarProps> = (props: MobileTopBarProps) => {
    const {theme, toggleTheme, onExit} = props;

    const getColors = () => {
        if (theme === 'dark') {
            return 'border-white/10 bg-slate-900 text-white';
        }
        return 'border-slate-200 bg-white text-slate-900';
    };

    const getExitButton = () => {
        return (
            <button
                onClick={onExit}
                className="px-2 py-1 rounded-lg font-bold text-xs flex items-center gap-1 text-red-500 hover:bg-red-500/10 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-400/40"
                aria-label="Geri Dön"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"/>
                </svg>
            </button>
        );
    };

    const getThemeButton = () => {
        return (
            <button onClick={toggleTheme}
                    className={`px-2 py-1 rounded-lg font-bold text-base transition-colors duration-150 focus:outline-none
            ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}
                    aria-label="Tema Değiştir">
                {theme === 'dark' ? '☀️' : '🌙'}
            </button>
        );
    };

    return (
        <nav
            className={`fixed top-0 left-0 w-full h-14 flex items-center justify-between px-4 z-[1000] ${getColors()}`}>
            <div className="flex items-center gap-2">
                <div
                    className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-black text-lg shadow">E
                </div>
                <span className="font-black text-base tracking-tight">IZMIR ULAŞ</span>
            </div>
            <div className="flex items-center">
                {getThemeButton()}
                {getExitButton()}
            </div>
        </nav>
    );
};

export default MobileTopBar;
