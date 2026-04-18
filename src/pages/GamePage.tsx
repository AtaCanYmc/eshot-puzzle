import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Stop } from '../types/supabaseTypes';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41]
});

interface GamePageProps {
  stops: [Stop, Stop];
}

const GamePage: React.FC<GamePageProps> = ({ stops }) => {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#f8fafc' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 1000, background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
        <div className="flex items-center justify-between px-4 py-3">
          <span className="font-bold text-blue-700 text-lg">ESHOT Puzzle</span>
          {/* Menü barı için ek butonlar buraya eklenebilir */}
        </div>
      </div>
      <MapContainer
        center={[(stops[0].enlem + stops[1].enlem) / 2, (stops[0].boylam + stops[1].boylam) / 2]}
        zoom={12}
        style={{ width: '100vw', height: '100vh' }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[stops[0].enlem, stops[0].boylam]} icon={markerIcon}>
          <Popup>Başlangıç: {stops[0].durak_adi}</Popup>
        </Marker>
        <Marker position={[stops[1].enlem, stops[1].boylam]} icon={markerIcon}>
          <Popup>Varış: {stops[1].durak_adi}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default GamePage;

