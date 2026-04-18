import React from 'react';
import type { Stop } from '../types/supabaseTypes';

interface GameStartModalProps {
  open: boolean;
  stops: [Stop, Stop] | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onStart: () => void;
  onClose: () => void;
}

const GameStartModal: React.FC<GameStartModalProps> = ({ open, stops, loading, error, onRefresh, onStart, onClose }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-card w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="p-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Yeni Görev</h2>
              <p className="text-slate-400 mt-1 uppercase text-xs font-bold tracking-widest">Rota Brifingi</p>
            </div>
            <button 
              onClick={onClose} 
              className="text-slate-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm flex gap-3 items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <p className="text-slate-400 text-sm animate-pulse">Duraklar aranıyor...</p>
            </div>
          ) : stops ? (
            <div className="space-y-8">
              <div className="relative">
                <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-blue-500 to-orange-500 opacity-30"></div>
                
                <div className="flex gap-4 items-center relative">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center shrink-0">
                    <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Başlangıç Noktası</p>
                    <p className="text-lg font-semibold text-white leading-tight">{stops[0].durak_adi}</p>
                  </div>
                </div>

                <div className="h-8"></div>

                <div className="flex gap-4 items-center relative">
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center shrink-0">
                    <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">Hedef Varış</p>
                    <p className="text-lg font-semibold text-white leading-tight">{stops[1].durak_adi}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between border border-white/5">
                <span className="text-slate-400 text-sm">Zorluk: Orta</span>
                <span className="text-slate-400 text-sm capitalize">İzmir, Türkiye</span>
              </div>
            </div>
          ) : null}
        </div>

        <div className="p-8 bg-white/5 border-t border-white/5 flex gap-4">
          <button 
            onClick={onRefresh} 
            disabled={loading} 
            className="flex-1 px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/></svg>
            Yenile
          </button>
          <button 
            onClick={onStart} 
            disabled={loading || !stops} 
            className="flex-[2] px-8 py-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-extrabold shadow-lg shadow-primary/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2"
          >
            Görevi Başlat
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameStartModal;

