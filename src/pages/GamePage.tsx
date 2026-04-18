import * as React from 'react';
import { MapContainer, TileLayer, Marker as RLMarker, Popup as RLPopup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { eshotService } from '../service/eshotService';
import type { Stop } from '../types/supabaseTypes';
import { useTheme } from '../ThemeContext';

// Custom Icons
const currentIcon = new L.DivIcon({
  className: 'custom-marker-current',
  html: '<div class="w-8 h-8 rounded-full bg-primary border-4 border-white shadow-lg animate-pulse"></div>',
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const targetIcon = new L.DivIcon({
  className: 'custom-marker-target',
  html: '<div class="w-8 h-8 rounded-full bg-orange-500 border-4 border-white shadow-lg"></div>',
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const stopIcon = new L.DivIcon({
  className: 'custom-marker-stop',
  html: '<div class="w-4 h-4 rounded-full bg-slate-400 border-2 border-white shadow-sm hover:scale-150 transition-transform"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

interface GamePageProps {
  stops: [Stop, Stop];
}

interface TravelState {
  currentStop: Stop;
  history: { stop: Stop; line?: string }[];
  steps: number;
  selectedLine: string | null;
  lineStops: Stop[];
}

// Map Helper Component to handle view changes
function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  React.useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

const GamePage: React.FC<GamePageProps> = ({ stops }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [gameState, setGameState] = React.useState<TravelState>({
    currentStop: stops[0],
    history: [{ stop: stops[0] }],
    steps: 0,
    selectedLine: null,
    lineStops: []
  });
  
  const [availableLines, setAvailableLines] = React.useState<{ hat_no: string }[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [isSidebarOpen, setSidebarOpen] = React.useState(true);

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
    fetchLines();
  }, [gameState.currentStop]);

  const handleSelectLine = async (hatNo: string) => {
    setLoading(true);
    try {
      // Directions: Try to find which direction might lead closer or just show both
      // For simplicity, we'll fetch stops for direction 1 and see if current stop is in it
      let lineStops = await eshotService.getOrderedStops(hatNo, 1);
      
      // If current stop is not in direction 1, try direction 2
      if (!lineStops.some(s => s.durak_id === gameState.currentStop.durak_id)) {
        lineStops = await eshotService.getOrderedStops(hatNo, 2);
      }

      setGameState(prev => ({ ...prev, selectedLine: hatNo, lineStops }));
    } catch (error) {
      console.error("Line stops fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTravelToStop = (targetStop: Stop) => {
    if (targetStop.durak_id === gameState.currentStop.durak_id) return;
    
    setGameState(prev => ({
      currentStop: targetStop,
      history: [...prev.history, { stop: targetStop, line: prev.selectedLine! }],
      steps: prev.steps + 1,
      selectedLine: null,
      lineStops: []
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
        <aside 
          className={`absolute left-0 top-0 bottom-0 z-[999] w-80 glass border-r transition-transform duration-500 ease-in-out
            ${theme === 'dark' ? 'border-white/10 bg-slate-950' : 'border-slate-200 bg-white'}
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="p-6 h-full flex flex-col">
            <header className="mb-6">
              <h2 className={`text-sm font-black uppercase tracking-widest mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Şu Anki Durak</h2>
              <p className={`text-xl font-bold leading-tight line-clamp-2 ${theme === 'dark' ? '' : 'text-slate-900'}`}>{gameState.currentStop.durak_adi}</p>
            </header>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative">
              {loading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/20 backdrop-blur-[2px]">
                  <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                </div>
              )}
              {!gameState.selectedLine ? (
                <section>
                  <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-primary' : 'text-blue-700'}`}> 
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M7 20h10"/><path d="M9 16v4"/><path d="M15 16v4"/></svg>
                    Geçen Hatlar
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {availableLines.length > 0 ? (
                      availableLines.map(line => (
                        <button
                          key={line.hat_no}
                          onClick={() => handleSelectLine(line.hat_no)}
                          className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-primary/20 hover:border-primary/40 transition-all text-center group"
                        >
                          <span className="block text-lg font-black group-hover:scale-110 transition-transform">{line.hat_no}</span>
                        </button>
                      ))
                    ) : (
                      <p className={`col-span-2 text-sm italic py-4 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Bu durakta hat bulunamadı.</p>
                    )}
                  </div>
                </section>
              ) : (
                <section className="animate-fade-in">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-secondary' : 'text-blue-700'}`}> 
                       {gameState.selectedLine} Hattı Durakları
                    </h3>
                    <button 
                      onClick={() => setGameState(prev => ({ ...prev, selectedLine: null, lineStops: [] }))}
                      className="text-[10px] font-bold text-slate-400 hover:text-white underline"
                    >
                      GERİ DÖN
                    </button>
                  </div>
                  <div className="space-y-2">
                    {gameState.lineStops.map((stop, idx) => {
                      const isCurrent = stop.durak_id === gameState.currentStop.durak_id;
                      return (
                        <button
                          key={`${stop.durak_id}-${idx}`}
                          disabled={isCurrent}
                          onClick={() => handleTravelToStop(stop)}
                          className={`w-full p-3 rounded-xl text-left border transition-all flex items-center gap-3 ${
                            isCurrent 
                              ? 'bg-primary/10 border-primary/20 opacity-50 cursor-default' 
                              : 'bg-white/5 border-transparent hover:border-white/20'
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full shrink-0 ${isCurrent ? 'bg-primary shadow-[0_0_8px_rgba(0,95,184,1)]' : 'bg-slate-600'}`}></div>
                          <span className={`text-sm font-semibold truncate ${theme === 'dark' ? '' : 'text-slate-900'}`}>{stop.durak_adi}</span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>

            <footer className={`mt-6 pt-6 border-t rounded-2xl p-4 ${theme === 'dark' ? 'border-white/10 bg-orange-500/10 border border-orange-500/20' : 'border-slate-200 bg-orange-100 border border-orange-300'}`}>
              <p className={`text-[10px] font-black uppercase mb-1 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-700'}`}>Hedef</p>
              <p className={`text-sm font-bold truncate ${theme === 'dark' ? '' : 'text-slate-900'}`}>{stops[1].durak_adi}</p>
            </footer>
          </div>

          {/* Toggle Button */}
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="absolute -right-10 top-1/2 -translate-y-1/2 w-10 h-20 glass border-l-0 border-white/10 rounded-r-2xl flex items-center justify-center hover:bg-white/5 transition-colors"
          >
            <div className={`transition-transform duration-500 ${isSidebarOpen ? '' : 'rotate-180'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </div>
          </button>
        </aside>

        {/* Map */}
        <div className={`flex-1 h-full w-full min-h-[400px] relative cursor-crosshair ${theme === 'dark' ? '' : 'bg-slate-100'}`}>
          <MapContainer
            className="h-full w-full min-h-[400px]"
            center={[gameState.currentStop.enlem, gameState.currentStop.boylam]}
            zoom={15}
            zoomControl={false}
            style={{ width: '100%', height: '100%', background: '#0f172a' }}
          >
            <TileLayer
              attribution={theme === 'dark' ? '&copy; CARTO' : '&copy; OpenStreetMap'}
              url={theme === 'dark'
                ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'}
            />
            
            <MapController center={[gameState.currentStop.enlem, gameState.currentStop.boylam]} zoom={15} />

            {/* Current Position */}
            <RLMarker position={[gameState.currentStop.enlem, gameState.currentStop.boylam]} icon={currentIcon}>
              <RLPopup className="premium-popup">
                <div className="p-2">
                  <p className="text-[10px] font-bold text-primary uppercase">Şu An Buradasın</p>
                  <p className="font-bold">{gameState.currentStop.durak_adi}</p>
                </div>
              </RLPopup>
            </RLMarker>

            {/* Target Position */}
            <RLMarker position={[stops[1].enlem, stops[1].boylam]} icon={targetIcon}>
              <RLPopup>
                <div className="p-2">
                  <p className="text-[10px] font-bold text-orange-500 uppercase">Hedef Durak</p>
                  <p className="font-bold">{stops[1].durak_adi}</p>
                </div>
              </RLPopup>
            </RLMarker>

            {/* Line Stops Markers (when line selected) */}
            {gameState.lineStops.map(s => (
              // @ts-expect-error RLMarker icon prop is not in type but works in runtime
              <RLMarker 
                key={s.durak_id} 
                position={[s.enlem, s.boylam]} 
                icon={stopIcon}
                eventHandlers={{ click: () => handleTravelToStop(s) }}
              >
                <RLPopup>
                  <div className="p-2 text-center">
                    <p className="font-bold text-sm mb-2">{s.durak_adi}</p>
                    <button 
                      onClick={() => handleTravelToStop(s)}
                      className="px-3 py-1 bg-primary rounded-lg text-xs font-bold"
                    >
                      Buran İle Devam Et
                    </button>
                  </div>
                </RLPopup>
              </RLMarker>
            ))}

            {/* Path visualization */}
            {gameState.lineStops.length > 1 && (
              <Polyline 
                positions={gameState.lineStops.map(s => [s.enlem, s.boylam])} 
                pathOptions={{ color: '#005FB8', weight: 4, opacity: 0.6, dashArray: '10, 10' }} 
              />
            )}
          </MapContainer>
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
