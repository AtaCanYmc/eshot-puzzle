import {eshotService} from "../service/eshotService";
import {useGameStore} from "../store/gameStore";

export const useEshot = () => {
    const {
        currentStop,
        setLineStops,
        setLoading,
        setSelectedLine,
        setSelectedDirection,
    } = useGameStore();

    const handleSelectLine = async (hatNo: string) => {
        if (!currentStop) return;
        setLoading(true);
        try {
            const dir = await eshotService.getAvailableDirections(currentStop.durak_id, hatNo)
            const stops = await eshotService.getOrderedStops(hatNo, dir[0].smart_yon, currentStop.durak_id);
            setSelectedLine(hatNo);
            setSelectedDirection(dir[0].smart_yon);
            setLineStops(stops);
        } catch (error) {
            setSelectedLine(null);
            setSelectedDirection(null);
            setLineStops([]);
        } finally {
            setLoading(false);
        }
    };
};