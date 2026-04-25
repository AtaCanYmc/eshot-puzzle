import * as React from 'react';
import {useGameStore} from '../../store/gameStore';

interface SidebarProps {
    theme: string;
}

const Sidebar: React.FC<SidebarProps> = ({theme}) => {
    const {
        currentStop,
        loading,
        targetStop,
        isSidebarOpen,
        setIsSidebarOpen
    } = useGameStore();

    const getAsideHeader = () => {
        if (!currentStop) return null;
        return (
            <header className="mb-6">
                <h2 className={`text-sm font-black uppercase tracking-widest mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Şu
                    Anki Durak</h2>
                <p className={`text-xl font-bold leading-tight line-clamp-2 ${theme === 'dark' ? '' : 'text-slate-900'}`}>{currentStop.durak_adi}</p>
            </header>
        );
    };

    const getSpinner = () => {
        if (!loading) return <></>;
        return (
            <div
                className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/20 backdrop-blur-[2px]">
                <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    };

    const getFooter = () => {
        return (
            <footer className={`mt-6 pt-6 border-t rounded-2xl p-4 ${theme === 'dark' ? 'border-white/10 bg-orange-500/10 border border-orange-500/20' : 'border-slate-200 bg-orange-100 border border-orange-300'}`}>
                <p className={`text-[10px] font-black uppercase mb-1 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-700'}`}>Hedef</p>
                <p className={`text-sm font-bold truncate ${theme === 'dark' ? '' : 'text-slate-900'}`}>{targetStop.durak_adi}</p>
            </footer>
        );
    }

    return (
        <aside
            className={`absolute left-0 top-0 bottom-0 z-[999] w-80 glass border-r transition-transform duration-500 ease-in-out
        ${theme === 'dark' ? 'border-white/10 bg-slate-950' : 'border-slate-200 bg-white'}
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
            <div className="p-6 h-full flex flex-col">
                {getAsideHeader()}
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative">
                    {getSpinner()}
                </div>
                {getFooter()}
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="absolute -right-10 top-1/2 -translate-y-1/2 w-10 h-20 glass border-l-0 border-white/10 rounded-r-2xl flex items-center justify-center hover:bg-white/5 transition-colors"
            >
                <div className={`transition-transform duration-500 ${isSidebarOpen ? '' : 'rotate-180'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </div>
            </button>
        </aside>
    );
};

export default Sidebar;

