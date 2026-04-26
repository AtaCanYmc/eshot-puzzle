import {eshotService} from "../service/eshotService";
import {useGameStore} from "../store/gameStore";
import {Stop, TasitTip} from "../types/supabaseTypes";
import {playSound} from "../utils/audioUtils";
import {sleep} from "../utils/commonUtils";
import {metroService} from "../service/metroService";
import {izbanService} from "../service/izbanService";
import MetroStopIcon from "../assets/svg/metro-stop.svg";
import IzbanStopIcon from "../assets/svg/metro-stop.svg";
import TramvayStopIcon from "../assets/svg/tram-stop.svg";
import FerryStopIcon from "../assets/svg/anchor.svg";
import EshotStopIcon from "../assets/svg/bus-stop.svg";

export const useCommonTravel = () => {
    const {
        currentStop,
        steps,
        selectedDirection,
        selectedLine,
        history,
        availableStops,
        setAvailableStops,
        setLoading,
        setLoadingIcon,
        setSelectedLine,
        setSelectedDirection,
        setAvailableLines,
        setSteps,
        setCurrentStop,
        setHistory,
        setSliderIndex
    } = useGameStore();

    const handleSelectLine = async (hatNo: string) => {
        if (!currentStop.durak_id) return;
        setLoading(true);
        try {
            const directions = await eshotService.getAvailableDirections(currentStop.durak_id, hatNo);
            const activeDirection = directions[0];
            const stops = await eshotService.getOrderedStops(hatNo, activeDirection.smart_yon, currentStop.durak_id);
            setSelectedLine(hatNo);
            setSelectedDirection(activeDirection.smart_yon);
            setAvailableStops(stops);
        } catch (error) {
            setSelectedLine(null);
            setSelectedDirection(null);
            setAvailableStops([]);
            console.error("Line selection failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectIstasyon = async () => {
        if (!currentStop.durak_type) return;
        const durakTipi = currentStop.durak_type;
        setLoading(true);
        setSelectedLine(null);
        setSelectedDirection(null);
        setAvailableLines([]);

        try {
            let stops = [] as Stop[];
            if (durakTipi === TasitTip.METRO) {
                stops = await metroService.getOrderedStops();
            } else if (durakTipi === TasitTip.IZBAN) {
                stops = await izbanService.getOrderedStops();
            } else {
                throw new Error("Invalid stop type for station selection");
            }
            setAvailableStops(stops);
        } catch (error) {
            setAvailableStops([]);
            console.error("Line selection failed", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchNearby = async () => {
        if (!currentStop.durak_id) return;
        setLoading(true);
        try {
            if (!currentStop) return;
            const {enlem, boylam, durak_id} = currentStop;
            const eshot = await eshotService.getNearbyStops(enlem, boylam, 200);
            const metro = await metroService.getNearbyStations(enlem, boylam, 500);
            const izban = await izbanService.getNearbyStations(enlem, boylam, 500);
            const data = [...eshot, ...metro, ...izban];
            const filtered = data.filter((s: Stop) => s.durak_type !== currentStop.durak_type || s.durak_id !== durak_id);
            setAvailableStops(filtered);
        } catch (e) {
            setAvailableStops([]);
            console.error("Nearby stops fetch failed", e);
        } finally {
            setLoading(false);
        }
    };

    const fetchLines = async () => {
        if (!currentStop.durak_id) return;
        setLoading(true);
        try {
            const lines = await eshotService.getHatlarByDurakId(currentStop.durak_id);
            setAvailableLines(lines.map(l => l.hat_no));
        } catch (error) {
            console.error("Lines fetch failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleTravelToStop = async (
        targetStop: Stop,
        icon?: any,
        sound?: any
    ) => {
        if (!availableStops.length || !currentStop.durak_id) return;
        if (targetStop.durak_id === currentStop.durak_id) return;

        setLoadingIcon(icon || null);
        setLoading(true);

        if (sound) {
            const sndObject = playSound(sound);
            try {
                const durationMs = sndObject.duration() * 1000;
                await sleep(durationMs);
            } finally {
                sndObject.stop();
            }
        }

        setCurrentStop(targetStop);
        setSteps(steps + 1);
        setSelectedLine(null);
        setSelectedDirection(null);
        setAvailableStops([]);
        setSliderIndex(0);
        setHistory([...history, {
            stop: targetStop,
            line: selectedLine!,
            direction: selectedDirection!
        }]);
        setLoading(false);
        setLoadingIcon(null);
    };

    const getStopIcon = (type?: string) => {
        switch (type) {
            case TasitTip.METRO:
                return MetroStopIcon;
            case TasitTip.IZBAN:
                return IzbanStopIcon;
            case TasitTip.TRAMVAY:
                return TramvayStopIcon;
            case TasitTip.VAPUR:
                return FerryStopIcon;
            default:
                return EshotStopIcon;
        }
    };

    return {
        handleSelectLine,
        fetchNearby,
        fetchLines,
        handleTravelToStop,
        getStopIcon,
        handleSelectIstasyon
    }
};