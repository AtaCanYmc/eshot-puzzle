import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRandomStops } from '../service/eshotService';
import type { Stop } from '../types/supabaseTypes';
import { useTheme } from '../ThemeContext';

const HomePage: React.FC = () => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [stops, setStops] = React.useState<[Stop, Stop] | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchRandomStops();
      setStops(result as [Stop, Stop]);
      setModalOpen(true);
    } catch (e) {
      setError('Duraklar alınırken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToGame = () => {
    if (stops) {
      navigate('/game', { state: { stops } });
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-center bg-no-repeat bg-cover relative" style={{backgroundImage: `url('/src/assets/hero-bg.png')`}}>
      <div className="absolute inset-0 w-full h-full bg-black/40 backdrop-blur-sm z-0" />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full">
        <h1 className="text-4xl font-black text-white mb-8 drop-shadow">ESHOT Puzzle</h1>
        <button
          className="px-8 py-4 rounded-2xl bg-white text-primary font-bold text-xl shadow-lg hover:scale-105 transition-transform"
          onClick={handleStart}
          disabled={loading}
        >
          {loading ? 'Yükleniyor...' : 'Oyuna Başla'}
        </button>
        {error && <div className="mt-4 text-red-500 font-bold">{error}</div>}

        {modalOpen && stops && (
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
              <div className="flex gap-4 justify-center">
                <button
                  className="px-6 py-3 rounded-xl bg-green-200 text-gray-700 font-bold text-lg shadow hover:scale-105 transition-transform"
                  onClick={handleGoToGame}
                >
                  Başla
                </button>
                <button
                  className="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-bold text-lg shadow hover:scale-105 transition-transform"
                  onClick={() => setModalOpen(false)}
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        )}
        <button
          className="absolute top-8 right-8 z-20 px-4 py-2 rounded-xl bg-white/80 text-slate-800 font-bold shadow hover:bg-white"
          onClick={toggleTheme}
          aria-label="Tema Değiştir"
        >
          {theme === 'dark' ? '☀️ Aydınlık' : '🌙 Karanlık'}
        </button>
      </div>
    </div>
  );
};

export default HomePage;
