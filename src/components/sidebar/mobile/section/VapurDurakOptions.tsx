import {Stop, TasitTip} from "../../../../types/supabaseTypes";
import * as React from "react";
import VapurIcon from '../../../../assets/svg/ferry.svg';
import VapurSound from '../../../../assets/sound/ferry.mp3';
import {useGameStore} from "../../../../store/gameStore";
import {useEffect} from "react";
import {useCommonTravel} from "../../../../hooks/useCommonTravel";

interface IProps {
    theme: string;
}

export const VapurDurakOptions = (props: IProps) => {
    const {theme} = props;

    const {
        currentStop,
        availableStops,
    } = useGameStore();

    const {handleTravelToStop, handleSelectIskele, handleGuzergahPoints} = useCommonTravel();

    const getDurakBulunamadi = () => {
        return (
            <div className={`text-xs italic ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                Varılacak iskele bulunamadı.
            </div>
        );
    };

    const getDurakButton = (stop: Stop) => {
        const isCurrent = stop.durak_id === currentStop.durak_id;

        return (
            <button
                key={stop.durak_id}
                onClick={() => handleTravelToStop(stop, VapurIcon, VapurSound)}
                className={`w-full p-2 rounded-xl text-left border flex items-center gap-2 transition-all
                        ${isCurrent ? 'bg-green-100 border-green-500 text-green-700 font-black' : 'bg-primary/10 border-primary text-primary hover:bg-primary/20'}`}
            >
                <span className={`w-2 h-2 rounded-full shrink-0 ${isCurrent ? 'bg-green-500' : 'bg-primary'}`}></span>
                <span className="flex flex-col">
                        <span className="text-xs font-semibold truncate max-w-[200px]">{stop.durak_adi}</span>
                      </span>
            </button>
        );
    };

    const getDurakList = () => {
        if (availableStops.length === 0) return getDurakBulunamadi();
        return availableStops.map(getDurakButton);
    };

    useEffect(() => {
        handleSelectIskele().then(r => r);
        handleGuzergahPoints().then(r => r);
    }, []);

    if ((currentStop.durak_type ?? TasitTip.ESHOT) !== TasitTip.VAPUR) return null;
    return (
        <section>
            <h3 className={`text-xs font-bold uppercase tracking-widest mb-2 ${theme === 'dark' ? 'text-primary' : 'text-blue-700'}`}>Varış İskeleleri</h3>
            <div className="space-y-1">
                {getDurakList()}
            </div>
        </section>
    );
};
