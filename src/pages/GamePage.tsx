import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { eshotService } from '../service/eshotService';
import type { Stop } from '../types/supabaseTypes';
import { useTheme } from '../ThemeContext';
import MapComponent from '../components/map/MapComponent';
import Sidebar from '../components/sidebar/Sidebar';
import GameTopBar from '../components/topbar/GameTopBar';
import useIsMobile from '../hooks/useIsMobile';
import MobileTopBar from '../components/topbar/MobileTopBar';
import MobileSideBar from '../components/sidebar/MobileSideBar';


interface GamePageProps {
  stops: [Stop, Stop];
}

interface TravelState {
  currentStop: Stop;
  history: { stop: Stop; line?: string; direction?: number }[];
  steps: number;
  selectedLine: string | null;
  selectedDirection: number | null;
  lineStops: Stop[];
}


const GamePage: React.FC<GamePageProps> = ({ stops }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [gameState, setGameState] = React.useState<TravelState & { isWalking?: boolean }>({
    currentStop: stops[0],
    history: [{ stop: stops[0] }],
    steps: 0,
    selectedLine: null,
    selectedDirection: null,
    lineStops: [],
    isWalking: false
  });

  const [availableLines, setAvailableLines] = React.useState<{ hat_no: string }[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [isSidebarOpen, setSidebarOpen] = React.useState(true);
  const [nearbyStops, setNearbyStops] = React.useState<Stop[]>([]);

  // Fetch lines for current stop
  React.useEffect(() => {
    const fetchLines = async () => {
      setLoading(true);
      try {
        const lines = await eshotService.getHatlarByDurakId(gameState.currentStop.durak_id);
        setAvailableLines(lines);
      } catch (error) {
        console.error("Lines fetch failed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLines().then(r => r);
  }, [gameState.currentStop]);

  // YAKIN DURAKLARI ÇEK
  React.useEffect(() => {
    if (!gameState.isWalking) return;
    let cancelled = false;
    async function fetchNearby() {
      try {
        const data = await eshotService.getNearbyStops(gameState.currentStop.enlem, gameState.currentStop.boylam, 200);
        // Sadece kendisini çıkar, history'de olanlar tekrar seçilebilir
        const filtered = data.filter((s: Stop) => s.durak_id !== gameState.currentStop.durak_id);
        if (!cancelled) setNearbyStops(filtered);
      } catch (e) {
        setNearbyStops([]);
      }
    }
    fetchNearby().then(r => r);
    return () => { cancelled = true; };
  }, [gameState.isWalking, gameState.currentStop, gameState.history]);

  // Hat seçildiğinde yönü otomatik bul ve durakları getir
  const handleSelectLine = async (hatNo: string) => {
    setLoading(true);
    try {
      // Yönleri getir
      const directions = await eshotService.getAvailableDirections(gameState.currentStop.durak_id, hatNo);
      if (!directions.length) throw new Error('Yön bulunamadı');
      const selectedDirection = directions[0].yon;
      // Durakları getir
      let lineStops = await eshotService.getOrderedStops(hatNo, selectedDirection);
      setGameState(prev => ({
        ...prev,
        selectedLine: hatNo,
        selectedDirection,
        lineStops,
        isWalking: false
      }));
    } catch (error) {
      setGameState(prev => ({ ...prev, selectedLine: null, selectedDirection: null, lineStops: [] }));
    } finally {
      setLoading(false);
    }
  };

  // Sadece ileriye gidilebilen duraklara geçiş izni
  const handleTravelToStop = (targetStop: Stop) => {
    if (!gameState.lineStops.length) return;
    const currentIndex = gameState.lineStops.findIndex(s => s.durak_id === gameState.currentStop.durak_id);
    const targetIndex = gameState.lineStops.findIndex(s => s.durak_id === targetStop.durak_id);
    // Sadece ileriye (currentIndex < targetIndex) gidilebilir
    if (targetStop.durak_id === gameState.currentStop.durak_id || targetIndex <= currentIndex) return;
    setGameState(prev => ({
      currentStop: targetStop,
      history: [...prev.history, { stop: targetStop, line: prev.selectedLine!, direction: prev.selectedDirection! }],
      steps: prev.steps + 1,
      selectedLine: null,
      selectedDirection: null,
      lineStops: []
    }));
  };

  // Yürüyerek gidilecek duraklara geçiş
  const handleWalkToStop = (targetStop: Stop) => {
    setGameState(prev => ({
      currentStop: targetStop,
      history: [...prev.history, { stop: targetStop, line: null, direction: null }],
      steps: prev.steps + 1,
      selectedLine: null,
      selectedDirection: null,
      lineStops: [],
      isWalking: false
    }));
  };

  const isGameWon = React.useMemo(() => {
    return gameState.currentStop.durak_id === stops[1].durak_id;
  }, [gameState.currentStop, stops]);

  return (
    <div
      className={`w-screen h-screen flex flex-col overflow-hidden transition-colors duration-300
        ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}
    >
      {/* Top Bar */}
      {useIsMobile() ? (
        <MobileTopBar
          theme={theme}
          toggleTheme={toggleTheme}
          steps={gameState.steps}
          onExit={() => navigate('/')}
          setSidebarOpen={setSidebarOpen}
        />
      ) : (
        <GameTopBar
          theme={theme}
          toggleTheme={toggleTheme}
          steps={gameState.steps}
          onExit={() => navigate('/')}
        />
      )}

      <div className="flex-1 flex relative overflow-hidden transition-colors duration-300">
        {/* Sidebar */}
        {useIsMobile() ? (
          <MobileSideBar
            gameState={gameState}
            setGameState={setGameState}
            theme={theme}
            availableLines={availableLines}
            loading={loading}
            nearbyStops={nearbyStops}
            handleSelectLine={handleSelectLine}
            handleTravelToStop={handleTravelToStop}
            handleWalkToStop={handleWalkToStop}
            stops={stops}
            isSidebarOpen={isSidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        ) : (
          <Sidebar
            gameState={gameState}
            setGameState={setGameState}
            theme={theme}
            availableLines={availableLines}
            loading={loading}
            nearbyStops={nearbyStops}
            handleSelectLine={handleSelectLine}
            handleTravelToStop={handleTravelToStop}
            handleWalkToStop={handleWalkToStop}
            stops={stops}
            isSidebarOpen={isSidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        )}

        {/* Map */}
        <div className={`flex-1 h-full w-full min-h-[400px] relative cursor-crosshair ${theme === 'dark' ? '' : 'bg-slate-100'}`}>
          <MapComponent
            currentStop={gameState.currentStop}
            stops={stops}
            gameState={gameState}
            setGameState={setGameState}
            theme={theme}
            toggleTheme={toggleTheme}
            lineStops={gameState.lineStops}
            onStopClick={(stop) => {
              if (stop.durak_id === gameState.currentStop.durak_id) return;
              setGameState(prev => ({
                ...prev,
                currentStop: stop,
                history: [...prev.history, { stop }],
                steps: prev.steps + 1,
                selectedLine: null,
                selectedDirection: null,
                lineStops: [],
                isWalking: false
              }));
            }}
          />
        </div>

        {/* Win Modal */}
        {isGameWon && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="glass-card max-w-md w-full p-8 text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.5)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <h2 className="text-4xl font-black mb-2 tracking-tighter uppercase">BAŞARDIN!</h2>
              <p className="text-slate-400 mb-8">
                Hedef noktasına toplam <span className="text-primary font-black">{gameState.steps}</span> adımda ulaştın. Harika bir iş çıkardın!
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
