import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import GamePage from './pages/GamePage';
import HomePage from './pages/HomePage';
import {useLocation} from 'react-router-dom';
import './index.css';

function GamePageWithState() {
    const location = useLocation();
    const stops = location.state?.stops;
    if (!stops) {
        return <div className="flex items-center justify-center min-h-screen text-2xl font-bold">Duraklar bulunamadı.
            Lütfen ana sayfadan oyuna başlayın.</div>;
    }
    return <GamePage stops={stops}/>;
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/game" element={<GamePageWithState/>}/>
            </Routes>
        </Router>
    );
}

export default App;

