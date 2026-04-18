import { useState, useEffect } from 'react';
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

interface RandomStopsMapProps {
  fetchStops: () => Promise<Stop[]>;
}

export default function RandomStopsMap({ fetchStops }: RandomStopsMapProps) {
  const [stops, setStops] = useState<Stop[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const [stop1, stop2] = await fetchStops();
      setStops([stop1, stop2]);
    } catch (e) {
      setError((e as Error).message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => { void handleFetch(); }, 0);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto my-8 p-4 bg-white rounded-2xl shadow-lg border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h2 className="text-2xl font-extrabold text-blue-800 tracking-tight">Birbirinden Uzak Rastgele 2 Durak</h2>
        <button
          onClick={handleFetch}
          disabled={loading}
          className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold shadow-lg hover:scale-105 hover:from-blue-600 hover:to-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? (
            <span className="flex items-center gap-2"><svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>Yükleniyor...</span>
          ) : 'Yeni Rastgele Duraklar Üret'}
        </button>
      </div>
      {error && <div className="text-red-600 mb-2 font-semibold">{error}</div>}
      {stops && (
        <div className="rounded-2xl overflow-hidden border border-gray-300 shadow-lg">
          <MapContainer
            center={[(stops[0].enlem + stops[1].enlem) / 2, (stops[0].boylam + stops[1].boylam) / 2]}
            zoom={11}
            style={{ width: '100%', height: '400px', borderRadius: '1rem' }}
            className="w-full h-[400px] z-0"
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {stops.map((stop, i) => (
              <Marker key={stop.durak_id} position={[stop.enlem, stop.boylam]} icon={markerIcon}>
                <Popup>
                  <div className="min-w-[180px] p-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-block w-3 h-3 rounded-full ${i === 0 ? 'bg-blue-600' : 'bg-green-600'}`}></span>
                      <span className="font-bold text-base text-gray-800">{stop.durak_adi}</span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">Enlem: <span className="font-mono">{stop.enlem}</span></div>
                    <div className="text-xs text-gray-600 mb-1">Boylam: <span className="font-mono">{stop.boylam}</span></div>
                    <div className="mt-2 text-xs text-gray-500 font-semibold">Durak #{i + 1}</div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  );
}

