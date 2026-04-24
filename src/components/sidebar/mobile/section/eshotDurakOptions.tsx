import type {Stop} from "../../../../types/supabaseTypes";
import * as React from "react";
import {sleep} from "../../../../utils/commonUtils";
import {playSound} from '../../../../utils/audioUtils';
import eshotSound from '../../../../assets/sound/eshot-travel-sound.mp3';
import {eshotService} from "../../../../service/eshotService";
import {useGameStore} from "../../../../store/gameStore";
import {useEffect} from "react";

interface IProps {
    hatNo: string;
    theme: string;
    handleTravelToStop: (stop: Stop) => void;
}

export const EshotDurakOptions = (props: IProps) => {
    const {
        hatNo,
        theme,
        handleTravelToStop
    } = props;

    const {
        currentStop,
        setLoading,
    } = useGameStore();

    const [lineStops, setLineStops] = React.useState<Stop[]>([]);

    const handleTravelToStopWithLoader = async (stop: Stop) => {
        const sound = playSound(eshotSound);
        try {
            const durationMs = sound.duration() * 1000;
            await sleep(durationMs);
            handleTravelToStop(stop);
        } finally {
            sound.stop();
        }
    };

    const getDurakBulunamadi = () => {
        return (
            <div className={`text-xs italic ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                Hatta ait durak bulunamadı.
            </div>
        );
    };

    const getDurakButton = (stop: Stop) => {
        if (stop.status_code === 0) return null;
        const isCurrent = stop.status_code === 2;

        return (
            <button
                key={stop.durak_id}
                onClick={() => handleTravelToStopWithLoader(stop)}
                className={`w-full p-2 rounded-xl text-left border flex items-center gap-2 transition-all
                        ${isCurrent ? 'bg-green-100 border-green-500 text-green-700 font-black' : 'bg-primary/10 border-primary text-primary hover:bg-primary/20'}`}
            >
                                            <span
                                                className={`w-2 h-2 rounded-full shrink-0 ${isCurrent ? 'bg-green-500' : 'bg-primary'}`}></span>
                <span className="flex flex-col">
                        <span className="text-xs font-semibold truncate">{stop.durak_adi}</span>
                        <span className="text-[10px] font-mono text-primary opacity-70">{stop.durak_id}</span>
                      </span>
            </button>
        );
    };

    const getDurakList = () => {
        if (lineStops.length === 0) return getDurakBulunamadi();
        return lineStops.map(getDurakButton);
    };

    const fetchDirection = async (durakId: number): Promise<number> => {
        const directions = await eshotService.getAvailableDirections(durakId, hatNo);
        if (!directions.length) throw new Error('Yön bulunamadı');
        return directions[0].smart_yon;
    };

    const fetchLineStops = async (durakId: number, direction: number) => {
        const result = await eshotService.getOrderedStops(hatNo, direction, durakId);
        setLineStops(result);
    };

    const handleErrors = (error: Error) => {
        console.error(error);
    }

    useEffect(() => {
        if (currentStop == null || currentStop?.durak_id === null) return;
        setLoading(true);
        fetchDirection(currentStop?.durak_id)
            .then(direction => fetchLineStops(currentStop.durak_id, direction))
            .catch(handleErrors)
            .finally(() => setLoading(false));
    }, [currentStop, hatNo]);

    return (
        <section>
            <h3 className={`text-xs font-bold uppercase tracking-widest mb-2 ${theme === 'dark' ? 'text-primary' : 'text-blue-700'}`}>Hat
                Durakları</h3>
            <div className="space-y-1">
                {getDurakList()}
            </div>
        </section>
    );
};
