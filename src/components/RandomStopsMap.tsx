import {useState, useEffect, useCallback} from 'react';
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
  fetchStops: () => Promise<[Stop, Stop]>;
}

export default function RandomStopsMap({ fetchStops }: RandomStopsMapProps) {
  const [stops, setStops] = useState<[Stop, Stop] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [stop1, stop2] = await fetchStops();
      setStops([stop1, stop2]);
    } catch (e) {
      setError((e as Error).message || 'Bir hata oluştu');
      setStops(null);
    } finally {
      setLoading(false);
    }
  }, [fetchStops]);

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  return (
    <div style={{ width: '100%', maxWidth: 600, margin: '2rem auto', padding: '1rem', background: 'white', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #e5e7eb' }}>
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
      {loading && (
        <div className="flex items-center justify-center h-[400px] w-full">
          <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
        </div>
      )}
      {stops && !loading && (
        <div style={{ borderRadius: '1rem', overflow: 'hidden', border: '1px solid #d1d5db', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <MapContainer
            center={[(stops[0].enlem + stops[1].enlem) / 2, (stops[0].boylam + stops[1].boylam) / 2]}
            zoom={11}
            style={{ width: '100%', height: 400, borderRadius: '1rem' }}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {stops.map((stop, i) => (
              <Marker key={stop.durak_id} position={[stop.enlem, stop.boylam]} icon={markerIcon}>
                <Popup>
                  <div style={{ minWidth: 180, padding: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 6, background: i === 0 ? '#2563eb' : '#16a34a' }}></span>
                      <span style={{ fontWeight: 700, fontSize: 16, color: '#1e293b' }}>{stop.durak_adi}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Enlem: <span style={{ fontFamily: 'monospace' }}>{stop.enlem}</span></div>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Boylam: <span style={{ fontFamily: 'monospace' }}>{stop.boylam}</span></div>
                    <div style={{ marginTop: 8, fontSize: 12, color: '#64748b', fontWeight: 600 }}>Durak #{i + 1}</div>
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
