import * as React from 'react';
import {useNavigate} from 'react-router-dom';
import type {Stop} from '../types/supabaseTypes';
import {useTheme} from '../ThemeContext';
import MapComponent from '../components/map/MapComponent';
import Sidebar from '../components/sidebar/Sidebar';
import GameTopBar from '../components/topbar/GameTopBar';
import useIsMobile from '../hooks/useIsMobile';
import MobileTopBar from '../components/topbar/MobileTopBar';
import MobileSideBar from '../components/sidebar/mobile/MobileSideBar';
import {useGameStore} from '../store/gameStore';
import {useCommonTravel} from "../hooks/useCommonTravel";
import LoaderOverlay from "../components/loader/LoaderOverlay";

interface GamePageProps {
    stops: [Stop, Stop];
}

const GamePage: React.FC<GamePageProps> = ({stops}) => {
    const navigate = useNavigate();
    const {theme, toggleTheme} = useTheme();
    const {fetchLines} = useCommonTravel();
    const isMobile = useIsMobile();
    const {
        loading,
        loadingIcon,
        currentStop,
        targetStop,
        reset,
        steps,
        setTargetStop
    } = useGameStore();

    // İlk render'da store'u başlat
    React.useEffect(() => {
        if (!currentStop.durak_id) {
            reset(stops[0]);
        }
        if (!targetStop.durak_id) {
            setTargetStop(stops[1]);
        }
        // eslint-disable-next-line
    }, [stops]);

    // Fetch lines for current stop
    React.useEffect(() => {
        fetchLines().then(r => r);
    }, [currentStop]);

    const isGameWon = React.useMemo(() => {
        return currentStop && currentStop.durak_id === stops[1].durak_id;
    }, [currentStop, stops]);

    const getTopBar = () => {
        if (isMobile) {
            return (
                <MobileTopBar
                    theme={theme}
                    toggleTheme={toggleTheme}
                    onExit={() => navigate('/')}
                />
            );
        }
        return (
            <GameTopBar
                theme={theme}
                toggleTheme={toggleTheme}
                steps={steps}
                onExit={() => navigate('/')}
            />
        );
    };
    
    const getLoader = () => {
        if (!loading) return null;
        return (
            <LoaderOverlay svgSrc={loadingIcon} text="Yükleniyor..."/>
        );
    };

    if (!currentStop.durak_id || !targetStop.durak_id) return <></>;
    return (
        <div
            className={`w-screen h-screen flex flex-col overflow-hidden transition-colors duration-300
        ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}
        >
            {getLoader()}
            {/* Top Bar */}
            {getTopBar()}

            <div className="flex-1 flex relative overflow-hidden transition-colors duration-300">
                {/* Sidebar */}
                {isMobile ? (
                    <MobileSideBar theme={theme}/>
                ) : (
                    <Sidebar theme={theme}/>
                )}

                {/* Map */}
                <div
                    className={`flex-1 h-full w-full min-h-[400px] relative cursor-crosshair ${theme === 'dark' ? '' : 'bg-slate-100'}`}>
                    {currentStop && (
                        <MapComponent
                            theme={theme}
                            toggleTheme={toggleTheme}
                        />
                    )}
                </div>

                {/* Win Modal */}
                {isGameWon && (
                    <div
                        className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
                        <div className="glass-card max-w-md w-full p-8 text-center">
                            <div
                                className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.5)]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"
                                     fill="none" stroke="white" strokeWidth="4" strokeLinecap="round"
                                     strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <h2 className="text-4xl font-black mb-2 tracking-tighter uppercase">BAŞARDIN!</h2>
                            <p className="text-slate-400 mb-8">
                                Hedef noktasına toplam <span
                                className="text-primary font-black">{steps}</span> adımda ulaştın. Harika bir
                                iş çıkardın!
                            </p>
                            <button
                                onClick={() => navigate('/')}
                                className="w-full py-4 rounded-2xl bg-primary hover:bg-primary-dark text-white font-black text-xl shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                YENİ GÖREV AL
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        .premium-popup .leaflet-popup-content-wrapper {
          background: rgba(15, 23, 42, 0.9);
          color: white;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(8px);
        }
        .premium-popup .leaflet-popup-tip {
          background: rgba(15, 23, 42, 0.9);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
      `}</style>
        </div>
    );
};

export default GamePage;
