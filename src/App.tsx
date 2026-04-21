import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GamePage from './pages/GamePage';
import HomePage from './pages/HomePage';
import { useLocation } from 'react-router-dom';
import './index.css';
import { useEffect } from 'react';
import { preloadSounds } from './utils/audioUtils';
import eshotSound from './assets/sound/eshot-travel-sound.mp3';

function GamePageWithState() {
    const location = useLocation();
    const stops = location.state?.stops;
    if (!stops) {
        return <div className="flex items-center justify-center min-h-screen text-2xl font-bold">Duraklar bulunamadı.
            Lütfen ana sayfadan oyuna başlayın.</div>;
    }
    return <GamePage stops={stops} />;
}

function App() {
    useEffect(() => {
        preloadSounds(eshotSound);
    }, []);
    return (
        <Router basename={import.meta.env.BASE_URL}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/game" element={<GamePageWithState />} />
            </Routes>
        </Router>
    );
}

export default App;

