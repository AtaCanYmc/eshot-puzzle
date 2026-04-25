import type {Stop} from "../../../../types/supabaseTypes";
import * as React from "react";
import {useGameStore} from "../../../../store/gameStore";
import {useCommonTravel} from "../../../../hooks/useCommonTravel";
import {useEffect} from "react";

interface IProps {
    theme: string;
}

export const WalkingDurakOptions = (props: IProps) => {
    const {theme} = props;
    const {availableStops} = useGameStore();
    const {handleTravelToStop, fetchNearby} = useCommonTravel();

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
                onClick={() => handleTravelToStop(stop)}
                className="w-full p-2 rounded-xl text-left border border-yellow-400 bg-yellow-50 hover:bg-yellow-100 text-yellow-900 flex items-center gap-2"
            >
                <span className="w-2 h-2 rounded-full bg-yellow-400 shrink-0"></span>
                <span className="flex flex-col text-xs font-semibold truncate">
                    {stop.durak_adi}
                    <span className="text-[10px] font-mono text-yellow-700 opacity-70">{stop.durak_id}</span>
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
