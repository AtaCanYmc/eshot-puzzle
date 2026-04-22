import * as React from 'react';
import type {Stop} from '../../../types/supabaseTypes';
import {EshotDurakOptions} from "./eshotDurakOptions";
import {MainOptions} from "./mainOptions";
import {WalkingDurakOptions} from "./walkingDurakOptions";
import LoaderOverlay from "../LoaderOverlay";
import EshotIcon from "../../../assets/svg/eshot.svg";
import TargetIcon from "../../../assets/svg/target.svg";
import {OptionSlider} from "./OptionSlider";

interface MobileSideBarProps {
    gameState: any;
    setGameState: React.Dispatch<React.SetStateAction<any>>;
    theme: string;
    availableLines: { hat_no: string }[];
    loading: boolean;
    nearbyStops: Stop[];
    handleSelectLine: (hatNo: string) => void;
    handleTravelToStop: (stop: Stop) => void;
    handleWalkToStop: (stop: Stop) => void;
    stops: [Stop, Stop];
    isSidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

const MobileSideBar: React.FC<MobileSideBarProps> = (props: MobileSideBarProps) => {
    const {
        gameState,
        setGameState,
        theme,
        availableLines,
        loading,
        nearbyStops,
        handleSelectLine,
        handleTravelToStop,
        handleWalkToStop,
        stops,
        isSidebarOpen,
        setSidebarOpen
    } = props;

    const toggleSideBar = () => {
        setSidebarOpen(!isSidebarOpen);
    }

    const getHeader = (showBackButton = false, onBack?: () => void) => {
        return (
            <header className="mb-4 flex items-center justify-between flex-col w-full">
                <div className={"w-full mt-1"}>
                    <h2 className={`text-xs font-black uppercase tracking-widest mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Şu
                        Anki Durak</h2>
                    <p className={`text-lg font-bold leading-tight line-clamp-2 ${theme === 'dark' ? '' : 'text-slate-900'}`}>{gameState.currentStop.durak_adi}</p>
                    <span className="text-xs font-mono text-primary opacity-70">{gameState.currentStop.durak_id}</span>
                </div>
                <OptionSlider gameState={gameState} setGameState={setGameState} theme={theme}
                              availableLines={availableLines} handleSelectLine={handleSelectLine}/>
            </header>
        );
    };

    const getLoader = () => {
        if (!loading) return <></>;
        return (
            <LoaderOverlay
                svgSrc={EshotIcon}
                text={'Yükleniyor...'}
            />
        );
    };

    const getFooter = () => {
        return (
            <footer
                className={`mt-2 pt-2 border-t rounded-xl px-2 pb-1 flex items-center gap-2 min-h-0 h-10 ${theme === 'dark' ? 'border-orange-500/20 bg-orange-500/10 border' : 'border-orange-300 bg-orange-100 border'}`}>
                <span className="flex items-center gap-1">
                    <img src={TargetIcon} alt="Hedef" className="w-4 h-4 inline-block" />
                    <span className={`text-xs font-bold truncate ${theme === 'dark' ? '' : 'text-slate-900'}`}>{stops[1].durak_adi}</span>
                </span>
            </footer>
        );
    };

    return (
        <aside className={`fixed left-0 bottom-0 z-[999] w-full max-w-full glass border-t transition-transform duration-500 ease-in-out
        ${theme === 'dark' ? 'border-white/10 bg-slate-900' : 'border-slate-200 bg-white'}
        ${isSidebarOpen ? 'translate-y-0 h-[calc(100%-200px)]' : 'translate-y-[calc(100%-180px)] h-[calc(100%-200px)]'}`}
        >
            <div className="p-4 h-full flex flex-col">
                {getHeader()}
                {isSidebarOpen && <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar relative">
                    {getLoader()}
                    {/* Hat/yürüme seçimi ekranı */}
                    <MainOptions gameState={gameState} setGameState={setGameState} theme={theme}
                                 availableLines={availableLines} handleSelectLine={handleSelectLine}/>
                    {/* Hat seçildiyse duraklar ve geri butonu */}
                    <EshotDurakOptions gameState={gameState} setGameState={setGameState} theme={theme}
                                       handleTravelToStop={handleTravelToStop}/>
                    {/* Yürüme modu aktifse yakındaki durakları listele */}
                    <WalkingDurakOptions gameState={gameState} setGameState={setGameState} theme={theme}
                                         handleWalkToStop={handleWalkToStop} nearbyStops={nearbyStops}/>
                </div>}
                {isSidebarOpen && getFooter()}
            </div>
            {/* Toggle Button */}
            <button
                onClick={() => toggleSideBar()}
                className="absolute right-4 top-2 w-8 h-8 glass flex items-center justify-center transition-colors"
                aria-label="Menüyü Kapat"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    {isSidebarOpen ? (
                        // Aşağı ok
                        <polyline points="6 9 12 15 18 9"/>
                    ) : (
                        // Yukarı ok
                        <polyline points="6 15 12 9 18 15"/>
                    )}
                </svg>
            </button>
        </aside>
    );
};

export default MobileSideBar;

