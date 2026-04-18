import { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import GamePage from './pages/GamePage';
import GameStartModal from './components/GameStartModal';
import { eshotService } from './service/eshotService';
import type { Stop } from './types/supabaseTypes';

function MainApp() {
  const [modalOpen, setModalOpen] = useState(false);
  const [stops, setStops] = useState<[Stop, Stop] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchTwoRandomStops = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await eshotService.getTwoRandomStops();
      setStops(result);
    } catch (e) {
      setError('Duraklar yüklenirken bir sorun oluştu. Lütfen tekrar deneyin.');
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
    <div 
      className="relative w-screen h-screen flex flex-col items-center justify-center overflow-hidden bg-slate-950"
      style={{
        backgroundImage: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.9)), url("/hero-bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Animated Overlay */}
      <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
      
      <div className="relative z-10 flex flex-col items-center max-w-2xl px-6 text-center animate-fade-in">
        <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-white/10 text-primary-light text-sm font-bold tracking-widest uppercase">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          İzmir Ulaşım Simülasyonu
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-6 leading-[0.9]">
          ESHOT<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary font-outline-2">PUZZLE</span>
        </h1>
        
        <p className="text-slate-300 text-lg md:text-xl mb-10 leading-relaxed font-light">
          İzmir'in labirent gibi sokaklarında doğru otobüsleri kullanarak hedefe ulaşabilir misin? En kısa rotayı bul, aktarmaları doğru yap.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button
            className="group relative px-10 py-5 rounded-2xl bg-primary text-white font-black text-xl shadow-[0_20px_50px_rgba(0,95,184,0.3)] hover:shadow-[0_20px_50px_rgba(0,95,184,0.5)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 overflow-hidden"
            onClick={handleOpenModal}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            OYUNA BAŞLA
          </button>
          
          <button
            className="px-10 py-5 rounded-2xl glass text-white font-bold text-xl hover:bg-white/10 transition-all duration-300 border-white/10"
          >
            NASIL OYNANIR?
          </button>
        </div>
        
        <div className="mt-16 flex items-center gap-8 text-slate-400 text-sm font-bold tracking-widest uppercase opacity-60">
          <span>90 DAKİKA</span>
          <span className="w-1 h-1 rounded-full bg-slate-600"></span>
          <span>SINIRSIZ AKTARMA</span>
          <span className="w-1 h-1 rounded-full bg-slate-600"></span>
          <span>GERÇEK VERİ</span>
        </div>
      </div>

      <GameStartModal 
        open={modalOpen}
        loading={loading}
        stops={stops}
        error={error}
        onRefresh={handleRefreshStops}
        onStart={handleStartGame}
        onClose={() => setModalOpen(false)}
      />

      {/* Decorative Blur Orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none"></div>
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
