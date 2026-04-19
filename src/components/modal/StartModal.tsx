import * as React from 'react';
import type { Stop } from '../../types/supabaseTypes';

interface StartModalProps {
  open: boolean;
  stops: [Stop, Stop] | null;
  loading: boolean;
  error?: string | null;
  onStart: () => void;
  onCancel: () => void;
}

const StartModal: React.FC<StartModalProps> = ({ open, stops, loading, error, onStart, onCancel }) => {
  if (!open || !stops) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-2xl w-full relative animate-fade-in">
        <h2 className="text-2xl font-black text-center mb-6 text-primary">Oynanacak Duraklar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[0,1].map(i => (
            <div key={i} className="flex flex-col items-center border-2 border-primary rounded-xl p-6 bg-gradient-to-b from-[#f3e8ff] to-[#fff] shadow-lg">
              <span className={`text-5xl font-black mb-2 ${i===0 ? 'text-blue-600' : 'text-green-600'}`}>{i===0 ? 'Başlangıç' : 'Hedef'}</span>
              <span className="text-xl font-bold text-slate-800 mb-2">{stops[i].durak_adi}</span>
              <span className="text-xs text-slate-500">Enlem: {stops[i].enlem}</span>
              <span className="text-xs text-slate-500">Boylam: {stops[i].boylam}</span>
            </div>
          ))}
        </div>
        {error && <div className="mt-4 text-red-500 font-bold">{error}</div>}
        <div className="flex gap-4 justify-center">
          <button
            className="px-6 py-3 rounded-xl bg-green-200 text-gray-700 font-bold text-lg shadow hover:scale-105 transition-transform"
            onClick={onStart}
            disabled={loading}
          >
            {loading ? 'Yükleniyor...' : 'Başla'}
          </button>
          <button
            className="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-bold text-lg shadow hover:scale-105 transition-transform"
            onClick={onCancel}
            disabled={loading}
          >
            İptal
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartModal;

