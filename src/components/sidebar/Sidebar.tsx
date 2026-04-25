import * as React from 'react';
import {useGameStore} from '../../store/gameStore';
import {useMemo} from "react";
import {MainOptions} from "./mobile/section/MainOptions";
import {WalkingDurakOptions} from "./mobile/section/WalkingDurakOptions";
import {EshotDurakOptions} from "./mobile/section/EshotDurakOptions";
import {OptionSlider} from "./mobile/slider/OptionSlider";
import TargetIcon from "../../assets/svg/target.svg";

interface SidebarProps {
    theme: string;
}

const Sidebar: React.FC<SidebarProps> = ({theme}) => {
    const {
        currentStop,
        isSidebarOpen,
        targetStop,
        toggleSidebar,
        availableLines,
        sliderIndex
    } = useGameStore();

    const sliderContents = useMemo(() => {
        const map = <MainOptions theme={theme}/>;
        const walk = <WalkingDurakOptions theme={theme}/>;
        const eshot = availableLines.map(line => <EshotDurakOptions key={line} hatNo={line} theme={theme}/>);
        return [map, walk, ...eshot];
    }, [availableLines]);

    const getAsideHeader = () => {
        if (!currentStop.durak_id) return null;
        return (
            <header className="mb-6">
                <h2 className={`text-sm font-black uppercase tracking-widest mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Şu
                    Anki Durak</h2>
                <p className={`text-xl font-bold leading-tight line-clamp-2 ${theme === 'dark' ? '' : 'text-slate-900'}`}>{currentStop.durak_adi}</p>
                <OptionSlider theme={theme}/>
            </header>
        );
    };

    const getFooter = () => {
        return (
            <footer
                className={`mt-2 pt-2 border-t rounded-xl px-2 pb-1 flex items-center gap-2 min-h-0 h-10 ${theme === 'dark' ? 'border-orange-500/20 bg-orange-500/10 border' : 'border-orange-300 bg-orange-100 border'}`}>
                <span className="flex items-center gap-1">
                    <img src={TargetIcon} alt="Hedef" className="w-4 h-4 inline-block"/>
                    <span
                        className={`text-xs font-bold truncate ${theme === 'dark' ? '' : 'text-slate-900'}`}>{targetStop.durak_adi}</span>
                </span>
            </footer>
        );
    };

    return (
        <aside
            className={`absolute left-0 top-0 bottom-0 z-[999] w-80 glass border-r transition-transform duration-500 ease-in-out
        ${theme === 'dark' ? 'border-white/10 bg-slate-950' : 'border-slate-200 bg-white'}
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
            <div className="p-6 h-full flex flex-col">
                {getAsideHeader()}
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative">
                    {sliderContents[sliderIndex]}
                </div>
                {getFooter()}
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => toggleSidebar()}
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

