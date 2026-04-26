import * as React from 'react';
import {MapContainer, TileLayer, Marker, Popup, Polyline} from 'react-leaflet';
import {DivIcon} from 'leaflet';
import {Stop, TasitTip} from '../../types/supabaseTypes';
import {useGameStore} from "../../store/gameStore";
import {useCommonTravel} from "../../hooks/useCommonTravel";

interface MapComponentProps {
    theme: string;
    toggleTheme: () => void;
}

const currentIcon = new DivIcon({
    className: 'custom-marker-current',
    html: '<div class="w-6 h-6 rounded-full bg-green-500 border-2 border-white shadow-lg animate-pulse"></div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
});

const targetIcon = new DivIcon({
    className: 'custom-marker-target',
    html: '<div class="w-6 h-6 rounded-full bg-orange-500 border-2 border-white shadow-lg"></div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
});

const stopIcon = new DivIcon({
    className: 'custom-marker-stop',
    html: '<div class="w-4 h-4 rounded-full bg-red-400 border-2 border-white shadow-sm hover:scale-150 transition-transform"></div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
});

const metroIcon = new DivIcon({
    className: 'custom-metro-marker-stop',
    html: '<div class="w-4 h-4 rounded-full bg-blue-400 border-2 border-white shadow-sm hover:scale-150 transition-transform"></div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
});

const izbanIcon = new DivIcon({
    className: 'custom-izban-marker-stop',
    html: '<div class="w-4 h-4 rounded-full bg-gray-400 border-2 border-white shadow-sm hover:scale-150 transition-transform"></div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
});

const MapComponent: React.FC<MapComponentProps> = (props: MapComponentProps) => {
    const {theme} = props;
    const {handleTravelToStop} = useCommonTravel();
    const {
        currentStop,
        targetStop,
        availableStops,
        sliderIndex,
        selectedGuzergahPoints
    } = useGameStore();

    const darkTile = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    const lightTile = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    const center = [currentStop.enlem, currentStop.boylam] as [number, number];
    const zoom = 14;

    const getGuzergah = () => {
        if (sliderIndex <= 1 || selectedGuzergahPoints.length < 1) return <></>;
        const color = theme === 'dark' ? '#38bdf8' : '#0ea5e9';
        const bgColor = theme === 'dark' ? '#000' : '#fff';
        return (
            <>
                <Polyline
                    positions={selectedGuzergahPoints as [number, number][]}
                    pathOptions={{
                        color: bgColor,
                        weight: 6,
                        opacity: 0.7,
                    }}
                />
                <Polyline
                    positions={selectedGuzergahPoints as [number, number][]}
                    pathOptions={{
                        color: color,
                        weight: 6,
                        opacity: 0.7,
                        dashArray: '5, 10',
                    }}
                />
            </>
        );
    };

    const getDurak = (stop: Stop, icon = stopIcon) => {
        return (
            <Marker
                key={stop.durak_id}
                position={[stop.enlem, stop.boylam]}
                // @ts-ignore
                icon={icon}
                eventHandlers={{click: () => handleTravelToStop(stop)}}
            >
                <Popup>{stop.durak_adi}</Popup>
            </Marker>
        );
    };

    const getAvailableDurakMarkers = () => {
        if (sliderIndex === 0) return <></>;
        if (!availableStops || availableStops.length === 0) return <></>;
        return (
            <>
                {
                    availableStops.map((stop: Stop) => {
                        if (stop.status_code === 0) return null; // Gidilemez durakları gösterme
                        switch (stop.durak_type) {
                            case TasitTip.METRO:
                                return getDurak(stop, metroIcon);
                            case TasitTip.IZBAN:
                                return getDurak(stop, izbanIcon);
                            default:
                                return getDurak(stop);
                        }
                    })
                }
            </>
        );
    };

    return (
        <MapContainer
            center={center}
            zoom={zoom}
            scrollWheelZoom={true}
            zoomControl={false}
            className="w-full h-full z-0"
            style={{background: theme === 'dark' ? '#0f172a' : '#f1f5f9'}}
        >
            <TileLayer
                // @ts-ignore
                attribution={attribution}
                url={theme === 'dark' ? darkTile : lightTile}
            />

            {/* Seçili hat güzergahı */}
            {getGuzergah()}

            {/* Hedef noktası */}
            {/* @ts-ignore */}
            <Marker position={[targetStop.enlem, targetStop.boylam]} icon={targetIcon}>
                <Popup>Hedef: {targetStop.durak_adi}</Popup>
            </Marker>

            {/* Şu anki konum */}
            {/* @ts-ignore */}
            <Marker position={[currentStop.enlem, currentStop.boylam]} icon={currentIcon}>
                <Popup>Şu Anki Durak: {currentStop.durak_adi}</Popup>
            </Marker>

            {/* Gidilebilecek duraklar */}
            {getAvailableDurakMarkers()}
        </MapContainer>
    );
};

export default MapComponent;
