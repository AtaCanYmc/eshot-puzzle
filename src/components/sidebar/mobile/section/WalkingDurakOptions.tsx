import type {Stop} from "../../../../types/supabaseTypes";
import * as React from "react";
import {useGameStore} from "../../../../store/gameStore";
import {useCommonTravel} from "../../../../hooks/useCommonTravel";
import WalkIcon from "../../../../assets/svg/walk.svg";
import WalkSound from "../../../../assets/sound/walk.mp3";
import {useEffect} from "react";

interface IProps {
    theme: string;
}

export const WalkingDurakOptions = (props: IProps) => {
    const {theme} = props;
    const {availableStops} = useGameStore();
    const {handleTravelToStop, fetchNearby, getStopIcon} = useCommonTravel();

    useEffect(() => {
        fetchNearby().then(r => r)
    }, []);

    const getDurakBulunamadi = () => {
        return (
            <div className={`text-xs italic ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                Yakında durak bulunamadı.
            </div>
        );
    };

    const getDurakButton = (stop: Stop) => {
        return (
            <button
                key={stop.durak_id}
                onClick={() => handleTravelToStop(stop, WalkIcon, WalkSound)}
                className="w-full p-2 rounded-xl text-left border flex items-center gap-2"
            >
                <img src={getStopIcon(stop.durak_type)} alt="tasit" className="w-5 h-5"/>
                <span className="flex flex-col text-xs font-semibold truncate max-w-[200px]">
                    {stop.durak_adi}
                    <span className="text-[10px] font-mono opacity-70">{stop.durak_id}</span>
                </span>
            </button>
        );
    };

    const getDurakList = () => {
        if (availableStops.length === 0) return getDurakBulunamadi();
        return availableStops.map(getDurakButton);
    };

    return (
        <section>
            <h3 className={`text-xs font-bold uppercase tracking-widest mb-2 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'}`}>Yakındaki
                Duraklar</h3>
            <div className="space-y-1">{getDurakList()}</div>
        </section>
    );
};
