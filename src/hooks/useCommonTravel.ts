import {eshotService} from "../service/eshotService";
import {useGameStore} from "../store/gameStore";
import type {Stop} from "../types/supabaseTypes";

export const useCommonTravel = () => {
    const {
        currentStop,
        steps,
        selectedDirection,
        selectedLine,
        history,
        setAvailableStops,
        setLoading,
        setSelectedLine,
        setSelectedDirection,
        setAvailableLines,
        setSteps,
        setCurrentStop,
        setHistory
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
            const data = await eshotService.getNearbyStops(enlem, boylam, 200);
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

    const handleTravelToStop = (targetStop: Stop) => {
        if (!setAvailableStops.length || !currentStop.durak_id) return;
        if (targetStop.durak_id === currentStop.durak_id) return;
        setCurrentStop(targetStop);
        setHistory([...history, {
            stop: targetStop,
            line: selectedLine!,
            direction: selectedDirection!
        }]);
        setSteps(steps + 1);
        setSelectedLine(null);
        setSelectedDirection(null);
        setAvailableStops([]);
    };

    return {
        handleSelectLine,
        fetchNearby,
        fetchLines,
        handleTravelToStop
    }
};