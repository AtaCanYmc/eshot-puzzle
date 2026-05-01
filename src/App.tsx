import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GamePage from './pages/GamePage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import { useLocation } from 'react-router-dom';
import './index.css';
import { useEffect } from 'react';
import { preloadSounds } from './utils/audioUtils';
import eshotSound from './assets/sound/eshot-travel-sound.mp3';

function GamePageWithState() {
    const location = useLocation();
    const stops = location.state?.stops;
    if (!stops) {
        return <NotFoundPage message={'Duraklar bulunamadı!'}/>;
    }
    return <GamePage stops={stops} />;
}

function App() {
    useEffect(() => {
        preloadSounds();
    }, []);
    return (
        <Router basename={import.meta.env.BASE_URL}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/game" element={<GamePageWithState />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
}

export default App;
