import {useState, useCallback} from 'react';
import {BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate} from 'react-router-dom';
import GamePage from './pages/GamePage';
import GameStartModal from './components/GameStartModal';
import {eshotService} from './service/eshotService';
import type {Stop} from './types/supabaseTypes';
import Button from './components/Button';

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
            setError('Duraklar yüklenirken bir sorun oluştu. Lütfen tekrar deneyin.'.concat(e.message));
            setStops(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleOpenModal = () => {
        setModalOpen(true);
        fetchTwoRandomStops().then(r => r);
    };

    const handleRefreshStops = () => {
        fetchTwoRandomStops().then(r => r);
    };

    const handleStartGame = () => {
        setModalOpen(false);
        if (stops) {
            navigate('/oyun', {state: {stops}});
        }
    };

    return (
        <div
            className="relative w-screen h-screen flex flex-col items-center justify-center overflow-hidden"
            style={{
                backgroundImage: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.95)), url("/hero-bg.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {/* Animated Overlay */}
            <div className="absolute inset-0 bg-primary/20 mix-blend-overlay"></div>

            <div
                className="relative z-10 flex flex-col items-center w-full max-w-5xl px-6 sm:px-12 md:px-24 py-10 md:py-24 text-center animate-fade-in gap-10 md:gap-16">
                <div
                    className="mb-8 inline-flex items-center gap-4 px-8 py-3 rounded-full glass border-white/10 text-blue-400 text-lg md:text-2xl font-bold tracking-widest uppercase shadow-lg">
          <span className="relative flex h-4 w-4">
            <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
          </span>
                    ESHOT PUZZLE
                </div>

                <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-6 leading-[0.9]">
                    ESHOT<br/>
                    <span
                        className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary font-outline-2">PUZZLE</span>
                </h1>

                <p className="text-slate-300 text-lg md:text-xl mb-10 leading-relaxed font-light">
                    İzmir'in labirent gibi sokaklarında doğru otobüsleri kullanarak hedefe ulaşabilir misin? En kısa
                    rotayı bul, aktarmaları doğru yap.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-6">
                    {/* Ana Buton: İçeriğe göre genişler, mobilde de devasa olmaz */}
                    <Button
                        variant="primary"
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                            <path d="M8 13V9m-2 2h4m5-2v.001M18 12v.001m4-.334v5.243a3.09 3.09 0 0 1-5.854 1.382L16 18a3.618 3.618 0 0 0-3.236-2h-1.528c-1.37 0-2.623.774-3.236 2l-.146.292A3.09 3.09 0 0 1 2 16.91v-5.243A6.667 6.667 0 0 1 8.667 5h6.666A6.667 6.667 0 0 1 22 11.667Z" />
                          </svg>
                        }
                        onClick={handleOpenModal}
                    >
                        OYUNA BAŞLA
                    </Button>

                    {/* İkincil Buton: Cam efekti, aynı yükseklik */}
                    <Button
                        variant="secondary"
                    >
                        NASIL OYNANIR?
                    </Button>
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
            <div
                className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div
                className="absolute -bottom-24 -right-24 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        </div>
    );
}

function GamePageWrapper() {
    const location = useLocation();
    const stops = location.state?.stops as [Stop, Stop] | undefined;
    if (!stops) return <Navigate to="/" replace/>;
    return <GamePage stops={stops}/>;
}

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainApp/>}/>
                <Route path="/oyun" element={<GamePageWrapper/>}/>
            </Routes>
        </Router>
    );
}
