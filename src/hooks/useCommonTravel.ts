import {eshotService} from "../service/eshotService";
import {useGameStore} from "../store/gameStore";
import type {Stop} from "../types/supabaseTypes";
import {playSound} from "../utils/audioUtils";
import {sleep} from "../utils/commonUtils";
import {metroService} from "../service/metroService";

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
            const dir = await eshotService.getAvailableDirections(currentStop.durak_id, hatNo)
            const stops = await eshotService.getOrderedStops(hatNo, dir[0].smart_yon, currentStop.durak_id);
            setSelectedLine(hatNo);
            setSelectedDirection(dir[0].smart_yon);
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

    const fetchNearby = async () => {
        if (!currentStop.durak_id) return;
        setLoading(true);
        try {
            if (!currentStop) return;
            const {enlem, boylam, durak_id} = currentStop;
            const eshot = await eshotService.getNearbyStops(enlem, boylam, 200);
            const metro = await metroService.getNearbyStations(enlem, boylam);
            const data = [...eshot, ...metro];
            const filtered = data.filter((s: Stop) => s.durak_id !== durak_id);
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

    return {
        handleSelectLine,
        fetchNearby,
        fetchLines,
        handleTravelToStop
    }
};