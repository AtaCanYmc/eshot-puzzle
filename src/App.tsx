import { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import GamePage from './pages/GamePage';
import { eshotService } from './service/eshotService';
import type { Stop } from './types/supabaseTypes';

function MainApp() {
  const [modalOpen, setModalOpen] = useState(false);
  const [stops, setStops] = useState<[Stop, Stop] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Rastgele durakları getiren fonksiyon
  const fetchTwoRandomStops = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await eshotService.getTwoRandomStops();
      setStops(result);
    } catch (e) {
      setError('Bir hata oluştu');
      setStops(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleOpenModal = () => {
    setModalOpen(true);
    fetchTwoRandomStops();
  };

  const handleRefreshStops = () => {
    fetchTwoRandomStops();
  };

  const handleStartGame = () => {
    setModalOpen(false);
    if (stops) {
      navigate('/oyun', { state: { stops } });
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="flex flex-col items-center gap-6 p-8 rounded-2xl shadow-xl bg-white/80 backdrop-blur">
        <h1 className="text-4xl font-extrabold text-blue-700 tracking-tight">ESHOT Puzzle</h1>
        <button
          className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold shadow-lg hover:scale-105 hover:from-blue-600 hover:to-blue-800 transition-all duration-200"
          onClick={handleOpenModal}
        >
          Oyuna Başla
        </button>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative flex flex-col items-center gap-4">
            <button onClick={() => setModalOpen(false)} className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
            <h2 className="text-2xl font-bold text-blue-700 mb-2">Rastgele Duraklar</h2>
            {error && <div className="text-red-600 mb-2 font-semibold">{error}</div>}
            {loading ? (
              <div className="flex items-center justify-center h-24">
                <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
              </div>
            ) : stops ? (
              <div className="w-full flex flex-col gap-2 mb-2">
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 flex flex-col items-center">
                  <span className="text-blue-700 font-bold">Başlangıç</span>
                  <span className="font-semibold text-gray-800">{stops[0].durak_adi}</span>
                </div>
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex flex-col items-center">
                  <span className="text-red-700 font-bold">Varış</span>
                  <span className="font-semibold text-gray-800">{stops[1].durak_adi}</span>
                </div>
              </div>
            ) : null}
            <div className="flex gap-2 justify-end mt-2 w-full">
              <button onClick={handleRefreshStops} disabled={loading} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold disabled:opacity-60">Yenile</button>
              <button onClick={handleStartGame} disabled={loading || !stops} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold disabled:opacity-60">Devam Et</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GamePageWrapper() {
  const location = useLocation();
  const stops = location.state?.stops as [Stop, Stop] | undefined;
  if (!stops) return <Navigate to="/" replace />;
  return <GamePage stops={stops} />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/oyun" element={<GamePageWrapper />} />
      </Routes>
    </Router>
  );
}
