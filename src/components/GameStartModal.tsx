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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl">&times;</button>
        <h2 className="text-xl font-bold text-blue-700 mb-4">Oyun Başlıyor!</h2>
        {error && <div className="text-red-600 mb-2 font-semibold">{error}</div>}
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          </div>
        ) : stops ? (
          <div className="mb-4">
            <div className="mb-2">
              <span className="font-semibold text-blue-600">Başlangıç:</span> {stops[0].durak_adi}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-green-600">Varış:</span> {stops[1].durak_adi}
            </div>
          </div>
        ) : null}
        <div className="flex gap-2 justify-end mt-4">
          <button onClick={onRefresh} disabled={loading} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold disabled:opacity-60">Yenile</button>
          <button onClick={onStart} disabled={loading || !stops} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold disabled:opacity-60">Devam Et</button>
        </div>
      </div>
    </div>
  );
};

export default GameStartModal;

