import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { eshotService } from '../service/eshotService';
import type { Stop } from '../types/supabaseTypes';
import { useTheme } from '../ThemeContext';
import MapComponent from '../components/MapComponent';
import Sidebar from '../components/Sidebar';


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
            <span className="text-xl font-black text-primary leading-none">{gameState.steps}</span>
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
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold text-sm transition-all"
          >
            ÇIKIŞ
          </button>
        </div>
      </nav>

      <div className="flex-1 flex relative overflow-hidden transition-colors duration-300">
        {/* Sidebar */}
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
