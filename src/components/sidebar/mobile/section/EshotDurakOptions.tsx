import {Stop, TasitTip} from "../../../../types/supabaseTypes";
import * as React from "react";
import eshotSound from '../../../../assets/sound/eshot-travel-sound.mp3';
import EshotIcon from '../../../../assets/svg/eshot.svg';
import {useGameStore} from "../../../../store/gameStore";
import {useEffect} from "react";
import {useCommonTravel} from "../../../../hooks/useCommonTravel";

interface IProps {
    hatNo: string;
    theme: string;
}

export const EshotDurakOptions = (props: IProps) => {
    const {hatNo, theme} = props;

    const {
        currentStop,
        availableStops,
    } = useGameStore();

    const {handleTravelToStop, handleSelectLine} = useCommonTravel();

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
                onClick={() => handleTravelToStop(stop, EshotIcon, eshotSound)}
                className={`w-full p-2 rounded-xl text-left border flex items-center gap-2 transition-all
                        ${isCurrent ? 'bg-green-100 border-green-500 text-green-700 font-black' : 'bg-primary/10 border-primary text-primary hover:bg-primary/20'}`}
            >
                <span className={`w-2 h-2 rounded-full shrink-0 ${isCurrent ? 'bg-green-500' : 'bg-primary'}`}></span>
                <span className="flex flex-col">
                        <span className="text-xs font-semibold truncate max-w-[200px]">{stop.durak_adi}</span>
                        <span className="text-[10px] font-mono text-primary opacity-70">{stop.durak_id}</span>
                      </span>
            </button>
        );
    };

    const getDurakList = () => {
        if (availableStops.length === 0) return getDurakBulunamadi();
        return availableStops.map(getDurakButton);
    };

    useEffect(() => {
        handleSelectLine(hatNo).then(r => r);
    }, []);

    if (currentStop.durak_type !== TasitTip.ESHOT) return null;
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
