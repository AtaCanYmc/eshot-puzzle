import * as React from 'react';
import type {Stop} from '../../../types/supabaseTypes';
import {EshotDurakOptions} from "./eshotDurakOptions";
import {MainOptions} from "./mainOptions";
import {WalkingDurakOptions} from "./walkingDurakOptions";

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
            <header className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className={`text-xs font-black uppercase tracking-widest mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Şu
                        Anki Durak</h2>
                    <p className={`text-lg font-bold leading-tight line-clamp-2 ${theme === 'dark' ? '' : 'text-slate-900'}`}>{gameState.currentStop.durak_adi}</p>
                    <span className="text-xs font-mono text-primary opacity-70">{gameState.currentStop.durak_id}</span>
                </div>
                {showBackButton && (
                    <button
                        onClick={onBack}
                        className="text-sm font-extrabold text-slate-400 hover:text-primary underline px-2 py-1 transition-colors"
                    >GERİ</button>
                )}
            </header>
        );
    };

    const getLoader = () => {
        if (!loading) return <></>;
        return (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/20 backdrop-blur-[2px]">
                <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    };

    /* const getWalkOptions = () => {
        if (!gameState.isWalking || gameState.selectedLine) return <></>;
        return (
            <section>
                {getHeader(true, () => setGameState((prev: any) => ({
                    ...prev,
                    isWalking: false
                })))}
                <h3 className={`text-xs font-bold uppercase tracking-widest mb-2 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'}`}>Yakındaki
                    Duraklar</h3>
                <div className="space-y-1">
                    {nearbyStops.length === 0 && (
                        <div
                            className={`text-xs italic ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Yakında
                            durak yok.</div>
                    )}
                    {nearbyStops.map((stop) => (
                        <button
                            key={stop.durak_id}
                            onClick={() => handleWalkToStopWithLoader(stop)}
                            className="w-full p-2 rounded-xl text-left border border-yellow-400 bg-yellow-50 hover:bg-yellow-100 text-yellow-900 flex items-center gap-2"
                        >
                            <span className="w-2 h-2 rounded-full bg-yellow-400 shrink-0"></span>
                            <span className="flex flex-col text-xs font-semibold truncate">
                      {stop.durak_adi}
                                <span
                                    className="text-[10px] font-mono text-yellow-700 opacity-70">{stop.durak_id}</span>
                    </span>
                        </button>
                    ))}
                </div>
            </section>
        );
    }; */

    const getFooter = () => {
        return (
            <footer
                className={`mt-4 pt-4 border-t rounded-2xl p-2 ${theme === 'dark' ? 'border-orange-500/20 bg-orange-500/10 border' : 'border-orange-300 bg-orange-100 border'}`}>
                <p className={`text-[10px] font-black uppercase mb-1 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-700'}`}>Hedef</p>
                <p className={`text-xs font-bold truncate ${theme === 'dark' ? '' : 'text-slate-900'}`}>{stops[1].durak_adi}</p>
            </footer>
        );
    };

    return (
        <aside
            className={`fixed left-0 bottom-0 z-[999] w-full max-w-full glass border-t transition-transform duration-500 ease-in-out
        ${theme === 'dark' ? 'border-white/10 bg-slate-900' : 'border-slate-200 bg-white'}
        ${isSidebarOpen ? 'translate-y-0 h-[calc(70%-50px)]' : 'translate-y-[calc(100%-100px)] h-[calc(70%-50px)]'}`}
        >
            <div className="p-4 h-full flex flex-col">
                {(!gameState.selectedLine && !gameState.isWalking) && getHeader()}
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
                className="absolute right-4 top-2 w-8 h-8 glass border border-white/10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"
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

