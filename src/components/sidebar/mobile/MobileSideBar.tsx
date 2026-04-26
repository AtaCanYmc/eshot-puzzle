import * as React from 'react';
import {useMemo} from 'react';
import {EshotDurakOptions} from "./section/EshotDurakOptions";
import {MainOptions} from "./section/MainOptions";
import {WalkingDurakOptions} from "./section/WalkingDurakOptions";
import TargetIcon from "../../../assets/svg/target.svg";
import {OptionSlider} from "./slider/OptionSlider";
import {useGameStore} from '../../../store/gameStore';
import {useCommonTravel} from "../../../hooks/useCommonTravel";
import {MetroDurakOptions} from "./section/MetroDurakOptions";
import {IzbanDurakOptions} from "./section/IzbanDurakOptions";

interface MobileSideBarProps {
    theme: string;
}

const MobileSideBar: React.FC<MobileSideBarProps> = ({theme}) => {
    const {
        currentStop,
        isSidebarOpen,
        targetStop,
        toggleSidebar,
        availableLines,
        sliderIndex
    } = useGameStore();

    const {getStopIcon} = useCommonTravel();

    const headerTheme = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
    const durakAdiTheme = theme === 'dark' ? '' : 'text-slate-900';
    const footerTheme = theme === 'dark' ? 'border-orange-500/20 bg-orange-500/10 border' : 'border-orange-300 bg-orange-100 border';

    const sliderContents = useMemo(() => {
        const map = <MainOptions theme={theme}/>;
        const walk = <WalkingDurakOptions theme={theme}/>;
        const eshot = availableLines.map(line => <EshotDurakOptions key={line} hatNo={line} theme={theme}/>);
        const metro = <MetroDurakOptions theme={theme}/>;
        const izban = <IzbanDurakOptions theme={theme}/>;
        return [map, walk, metro, izban, ...eshot].filter(Boolean);
    }, [currentStop, availableLines]);

    const getHeader = () => {
        if (!currentStop) return null;
        return (
            <header className="mb-4 flex items-center flex-col w-full">
                <div className={"w-full mt-1 flex flex-row gap-4 items-center"}>
                    <img src={getStopIcon(currentStop.durak_type)} alt="tasit" className="w-12 h-12"/>
                    <div className={"w-full mt-1"}>
                        <h2 className={`text-xs font-black uppercase tracking-widest mb-1 ${headerTheme}`}>Şu Anki Durak</h2>
                        <p className={`text-lg font-bold leading-tight line-clamp-2 ${durakAdiTheme}`}>{currentStop.durak_adi}</p>
                        <span className="text-xs font-mono text-primary opacity-70">{currentStop.durak_id}</span>
                    </div>
                </div>
                <OptionSlider theme={theme}/>
            </header>
        );
    };

    const getFooter = () => {
        if (!targetStop.durak_id) return null;
        return (
            <footer
                className={`mt-2 pt-2 border-t rounded-xl px-2 pb-1 flex items-center gap-2 min-h-0 h-10 ${footerTheme}`}>
                <span className="flex items-center gap-1">
                    <img src={TargetIcon} alt="Hedef" className="w-4 h-4 inline-block"/>
                    <span
                        className={`text-xs font-bold truncate ${durakAdiTheme}`}>{targetStop.durak_adi}</span>
                </span>
            </footer>
        );
    };

    const barIcon = useMemo(() => {
        if (isSidebarOpen) {
            // Aşağı ok
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"/>
                </svg>
            );
        } else {
            // Yukarı ok
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 15 12 9 18 15"/>
                </svg>
            );
        }
    }, [isSidebarOpen]);

    const toggleButton = useMemo(() => {
        return (
            <button
                onClick={toggleSidebar}
                className="absolute right-4 top-2 w-8 h-8 glass flex items-center justify-center transition-colors"
                aria-label="Menüyü Kapat"
            >
                {barIcon}
            </button>
        );
    }, [barIcon]);

    return (
        <aside className={`fixed left-0 bottom-0 z-[999] w-full max-w-full glass border-t transition-transform duration-500 ease-in-out
        ${theme === 'dark' ? 'border-white/10 bg-slate-900' : 'border-slate-200 bg-white'}
        ${isSidebarOpen ? 'translate-y-0 h-[calc(100%-200px)]' : 'translate-y-[calc(100%-180px)] h-[calc(100%-200px)]'}`}
        >
            <div className="p-4 h-full flex flex-col">
                {getHeader()}
                <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar relative">
                    {sliderContents[sliderIndex]}
                </div>
                {getFooter()}
            </div>
            {toggleButton}
        </aside>
    );
};

export default MobileSideBar;
