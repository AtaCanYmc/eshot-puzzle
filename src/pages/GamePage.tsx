// Modern ve minimalist bir oyun ekranı için tamamen yeni bir yapı
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Stop } from '../types/supabaseTypes';
import { useNavigate } from 'react-router-dom';

const startIcon = new L.Icon({
  iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-blue.png',
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -40],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [48, 48]
});
const finishIcon = new L.Icon({
  iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-red.png',
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -40],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [48, 48]
});

interface GamePageProps {
  stops: [Stop, Stop];
}

const GamePage: React.FC<GamePageProps> = ({ stops }) => {
  const navigate = useNavigate();
  return (
    <div className="w-screen h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-200">
      {/* Üstte minimalist bar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur shadow-md z-20">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-xl shadow">E</span>
          <span className="font-bold text-blue-700 text-lg tracking-tight">ESHOT Puzzle</span>
        </div>
        <button
          className="px-5 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold shadow transition-all"
          onClick={() => navigate('/')}
        >
          Çık
        </button>
      </nav>
      {/* Harita tam ekran */}
      <div className="flex-1 w-full h-full relative">
        <MapContainer
          center={[(stops[0].enlem + stops[1].enlem) / 2, (stops[0].boylam + stops[1].boylam) / 2]}
          zoom={13}
          style={{ width: '100%', height: '100%' }}
          className="absolute inset-0 z-0"
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[stops[0].enlem, stops[0].boylam]} icon={startIcon}>
            <Popup>
              <div className="min-w-[160px] p-2 text-center">
                <div className="font-bold text-blue-700 mb-1">Başlangıç Noktası</div>
                <div className="text-gray-800 font-semibold mb-1">{stops[0].durak_adi}</div>
                <div className="text-xs text-gray-500">({stops[0].enlem}, {stops[0].boylam})</div>
              </div>
            </Popup>
          </Marker>
          <Marker position={[stops[1].enlem, stops[1].boylam]} icon={finishIcon}>
            <Popup>
              <div className="min-w-[160px] p-2 text-center">
                <div className="font-bold text-red-700 mb-1">Varış Noktası</div>
                <div className="text-gray-800 font-semibold mb-1">{stops[1].durak_adi}</div>
                <div className="text-xs text-gray-500">({stops[1].enlem}, {stops[1].boylam})</div>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default GamePage;
