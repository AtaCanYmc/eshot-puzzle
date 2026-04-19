import * as React from 'react';
import type { Stop } from '../../types/supabaseTypes';

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

const MobileSideBar: React.FC<MobileSideBarProps> = ({
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
}) => {
  return (
    <aside
      className={`fixed left-0 bottom-0 top-14 z-[999] w-full max-w-full glass border-t transition-transform duration-500 ease-in-out
        ${theme === 'dark' ? 'border-white/10 bg-slate-900' : 'border-slate-200 bg-white'}
        ${isSidebarOpen ? 'translate-y-0' : 'translate-y-full'}`}
      style={{height: 'calc(100vh - 56px)'}}
    >
      <div className="p-4 h-full flex flex-col">
        <header className="mb-4">
          <h2 className={`text-xs font-black uppercase tracking-widest mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Şu Anki Durak</h2>
          <p className={`text-lg font-bold leading-tight line-clamp-2 ${theme === 'dark' ? '' : 'text-slate-900'}`}>{gameState.currentStop.durak_adi}</p>
        </header>
        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar relative">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/20 backdrop-blur-[2px]">
              <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
          )}
          {/* Hat/yürüme seçimi ekranı */}
          {!gameState.selectedLine && !gameState.isWalking && (
            <section>
              <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-primary' : 'text-blue-700'}`}>Geçen Hatlar</h3>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  className={`p-2 rounded-xl border-2 text-center group col-span-2 flex items-center justify-center gap-2 ${gameState.isWalking ? 'bg-yellow-100 border-yellow-400 text-yellow-700 font-black' : 'bg-white/5 border-yellow-400 text-yellow-700 hover:bg-yellow-50'}`}
                  onClick={() => setGameState((prev: any) => ({ ...prev, isWalking: !prev.isWalking, selectedLine: null, selectedDirection: null, lineStops: [] }))}
                >
                  <span className="text-xl">🚶‍♂️</span> Yürü
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {availableLines.length > 0 ? (
                  availableLines.map(line => (
                    <button
                      key={line.hat_no}
                      onClick={() => handleSelectLine(line.hat_no)}
                      className={`p-2 rounded-xl border-2 text-center group
                        ${gameState.selectedLine === line.hat_no
                          ? 'bg-primary/10 border-primary text-primary font-black'
                          : 'bg-white/5 border-primary/60 text-slate-800 hover:bg-primary/10 hover:border-primary'}
                      `}
                    >
                      <span className="block text-base font-black group-hover:scale-110 transition-transform">{line.hat_no}</span>
                    </button>
                  ))
                ) : (
                  <p className={`col-span-2 text-xs italic py-2 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Bu durakta hat bulunamadı.</p>
                )}
              </div>
            </section>
          )}
          {/* Hat seçildiyse duraklar ve geri butonu */}
          {gameState.selectedLine && !gameState.isWalking && (
            <section>
              <div className="flex items-center justify-between mb-2">
                <h3 className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-primary' : 'text-blue-700'}`}>Hat Durakları</h3>
                <button
                  onClick={() => setGameState((prev: any) => ({ ...prev, selectedLine: null, selectedDirection: null, lineStops: [] }))}
                  className="text-[10px] font-bold text-slate-400 hover:text-primary underline"
                >GERİ</button>
              </div>
              <div className="space-y-1">
                {gameState.lineStops.length === 0 && (
                  <div className={`text-xs italic ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Duraklar yükleniyor veya bulunamadı.</div>
                )}
                {gameState.lineStops.length > 0 && gameState.lineStops.map((stop: Stop) => {
                  const isCurrent = stop.durak_id === gameState.currentStop.durak_id;
                  const isPast = gameState.history.some((h: any) => h.stop.durak_id === stop.durak_id);
                  return (
                    <button
                      key={stop.durak_id}
                      onClick={() => handleTravelToStop(stop)}
                      className={`w-full p-2 rounded-xl text-left border flex items-center gap-2 transition-all
                        ${isCurrent
                          ? 'bg-green-100 border-green-500 text-green-700 font-black'
                          : isPast
                            ? 'bg-primary/10 border-primary text-primary opacity-50 pointer-events-none'
                            : 'bg-primary/10 border-primary text-primary hover:bg-primary/20'}
                      `}
                    >
                      <span className={`w-2 h-2 rounded-full shrink-0 ${isCurrent ? 'bg-green-500' : 'bg-primary'}`}></span>
                      <span className="flex flex-col">
                        <span className="text-xs font-semibold truncate">{stop.durak_adi}</span>
                        <span className="text-[10px] font-mono text-primary opacity-70">{stop.durak_id}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}
          {/* Yürüme modu aktifse yakındaki durakları listele */}
          {gameState.isWalking && !gameState.selectedLine && (
            <section>
              <div className="flex items-center justify-between mb-2">
                <h3 className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'}`}>Yakındaki Duraklar</h3>
                <button
                  onClick={() => setGameState((prev: any) => ({ ...prev, isWalking: false }))}
                  className="text-[10px] font-bold text-slate-400 hover:text-yellow-500 underline"
                >GERİ DÖN</button>
              </div>
              <div className="space-y-1">
                {nearbyStops.length === 0 && (
                  <div className={`text-xs italic ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Yakında durak yok.</div>
                )}
                {nearbyStops.map((stop) => (
                  <button
                    key={stop.durak_id}
                    onClick={() => handleWalkToStop(stop)}
                    className="w-full p-2 rounded-xl text-left border border-yellow-400 bg-yellow-50 hover:bg-yellow-100 text-yellow-900 flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-yellow-400 shrink-0"></span>
                    <span className="flex flex-col text-xs font-semibold truncate">
                      {stop.durak_adi}
                      <span className="text-[10px] font-mono text-yellow-700 opacity-70">{stop.durak_id}</span>
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
        <footer className={`mt-4 pt-4 border-t rounded-2xl p-2 ${theme === 'dark' ? 'border-white/10 bg-orange-500/10 border border-orange-500/20' : 'border-slate-200 bg-orange-100 border border-orange-300'}`}>
          <p className={`text-[10px] font-black uppercase mb-1 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-700'}`}>Hedef</p>
          <p className={`text-xs font-bold truncate ${theme === 'dark' ? '' : 'text-slate-900'}`}>{stops[1].durak_adi}</p>
        </footer>
      </div>
      {/* Toggle Button */}
      <button
        onClick={() => setSidebarOpen(false)}
        className="absolute right-4 top-2 w-8 h-8 glass border border-white/10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"
        aria-label="Menüyü Kapat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </aside>
  );
};

export default MobileSideBar;

