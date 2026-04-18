import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRandomStops } from '../service/eshotService';
import type { Stop } from '../types/supabaseTypes';
import { useTheme } from '../ThemeContext';
import StartModal from '../components/StartModal';

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

        <StartModal
          open={modalOpen}
          stops={stops}
          loading={loading}
          error={error}
          onStart={handleGoToGame}
          onCancel={() => setModalOpen(false)}
        />

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
