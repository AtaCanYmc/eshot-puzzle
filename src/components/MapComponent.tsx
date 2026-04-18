import * as React from 'react';
import {MapContainer, TileLayer, Marker, Popup, Polyline} from 'react-leaflet';
import { DivIcon } from 'leaflet';
import type {Stop} from '../types/supabaseTypes';
import {eshotService} from "../service/eshotService";


interface MapComponentProps {
    currentStop: Stop;
    stops: [Stop, Stop];
    gameState: any;
    setGameState: (fn: (prev: any) => any) => void;
    theme: string;
    toggleTheme: () => void;
    onStopClick?: (stop: Stop) => void;
    lineStops?: Stop[];
}

const currentIcon = new DivIcon({
    className: 'custom-marker-current',
    html: '<div class="w-8 h-8 rounded-full bg-green-500 border-4 border-white shadow-lg animate-pulse"></div>',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
});

const targetIcon = new DivIcon({
    className: 'custom-marker-target',
    html: '<div class="w-8 h-8 rounded-full bg-orange-500 border-4 border-white shadow-lg"></div>',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
});

const stopIcon = new DivIcon({
    className: 'custom-marker-stop',
    html: '<div class="w-4 h-4 rounded-full bg-slate-400 border-2 border-white shadow-sm hover:scale-150 transition-transform"></div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
});

const walkIcon = new DivIcon({
    className: 'custom-marker-walk',
    html: '<div class="w-6 h-6 rounded-full bg-yellow-400 border-4 border-white shadow"></div>',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

const MapComponent: React.FC<MapComponentProps> = ({currentStop, stops, gameState, setGameState, theme, onStopClick, lineStops}) => {
            // Hat güzergahı için Polyline koordinatları
            const polylinePositions = (lineStops && lineStops.length > 1)
                ? lineStops.map(stop => [stop.enlem, stop.boylam])
                : [];
    // Harita merkezini güncelle
    const darkTile = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    const lightTile = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    const center = [currentStop.enlem, currentStop.boylam] as [number, number];
    const zoom = 14;

    const [nearbyStops, setNearbyStops] = React.useState<Stop[]>([]);

    React.useEffect(() => {
        let cancelled = false;
        async function fetchNearby() {
            try {
                const data = await eshotService.getNearbyStops(currentStop.enlem, currentStop.boylam, 200); // 200m
                const filtered = data.filter((s: Stop) => s.durak_id !== currentStop.durak_id);
                if (!cancelled) setNearbyStops(filtered);
            } catch (e) {
                setNearbyStops([]);
            }
        }
        fetchNearby().then(r => r);
        return () => { cancelled = true; };
    }, [currentStop]);

    // Yürüyerek gidilen durağa geçiş
    const handleWalkToStop = (stop: Stop) => {
        setGameState((prev: any) => ({
            ...prev,
            currentStop: stop,
            history: [...prev.history, { stop, walk: true }],
            steps: prev.steps + 1,
            selectedLine: null,
            selectedDirection: null,
            lineStops: [],
            isWalking: false
        }));
    };

    return (
        <MapContainer
            center={center}
            zoom={zoom}
            scrollWheelZoom={true}
            className="w-full h-full z-0"
            style={{background: theme === 'dark' ? '#0f172a' : '#f1f5f9'}}
        >
            <TileLayer
                // @ts-ignore
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url={theme === 'dark' ? darkTile : lightTile}
            />

            {/* Seçili hat güzergahı */}
            {polylinePositions.length > 1 && (
                <Polyline
                    positions={polylinePositions as [number, number][]}
                    pathOptions={{color: theme === 'dark' ? '#38bdf8' : '#0ea5e9', weight: 6, opacity: 0.7}}
                />
            )}

            {/* Hedef noktası */}
            {/* @ts-ignore */}
            <Marker position={[stops[1].enlem, stops[1].boylam]} icon={targetIcon}>
                <Popup>Hedef: {stops[1].durak_adi}</Popup>
            </Marker>

            {/* Şu anki konum */}
            {/* @ts-ignore */}
            <Marker position={[currentStop.enlem, currentStop.boylam]} icon={currentIcon}>
                <Popup>Şu Anki Durak: {currentStop.durak_adi}</Popup>
            </Marker>

            {/* Gidilebilecek duraklar */}
            {gameState.lineStops && gameState.lineStops.length > 0 && gameState.lineStops.map((stop: Stop, idx: number) => {
                const currentIndex = gameState.lineStops.findIndex((s: Stop) => s.durak_id === currentStop.durak_id);
                const isPast = idx <= currentIndex;
                if (isPast) return null;
                return (
                    // @ts-ignore
                    <Marker
                        key={stop.durak_id}
                        position={[stop.enlem, stop.boylam]}
                        icon={stopIcon}
                        eventHandlers={onStopClick ? { click: () => onStopClick(stop) } : undefined}
                    >
                        <Popup>{stop.durak_adi}</Popup>
                    </Marker>
                );
            })}

            {/* Yakındaki duraklar (yürüyerek gidilebilir) */}
            {gameState.isWalking && nearbyStops.map((stop) => (
                // @ts-ignore
                <Marker key={"walk-"+stop.durak_id} position={[stop.enlem, stop.boylam]} icon={walkIcon} eventHandlers={{ click: () => handleWalkToStop(stop) }}>
                    <Popup>
                        <div>
                            <div className="font-bold">{stop.durak_adi}</div>
                            <button className="mt-2 px-3 py-1 rounded bg-yellow-400 text-black font-bold" onClick={() => handleWalkToStop(stop)}>
                                Buraya Yürü
                            </button>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapComponent;
