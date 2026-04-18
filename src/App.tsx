import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GamePage from './pages/GamePage';
import './index.css';


function App() {
  // Dummy stops
  const stops = [
    {
      durak_id: 1,
      durak_adi: 'Dummy Başlangıç',
      enlem: 38.4192,
      boylam: 27.1287
    },
    {
      durak_id: 2,
      durak_adi: 'Dummy Hedef',
      enlem: 38.4292,
      boylam: 27.1387
    }
  ];
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GamePage stops={stops} />} />
      </Routes>
    </Router>
  );
}

export default App;

