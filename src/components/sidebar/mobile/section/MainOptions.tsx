import WalkIcon from "../../../../assets/svg/walk.svg";
import EshotIcon from "../../../../assets/svg/eshot.svg";
import MetroIcon from "../../../../assets/svg/metro.svg";
import IzbanIcon from "../../../../assets/svg/izban.svg";
import * as React from "react";
import {useCommonTravel} from "../../../../hooks/useCommonTravel";
import {useGameStore} from "../../../../store/gameStore";
import {TasitButton} from "../../../button/TasitButton";
import {TasitTip} from "../../../../types/supabaseTypes";

interface IProps {
    theme: string;
}

export const MainOptions = (props: IProps) => {
    const {theme} = props;
    const {handleSelectLine, handleSelectIstasyon} = useCommonTravel();
    const {
        currentStop,
        availableLines,
        setSliderIndex
    } = useGameStore();

    const getWalkingButton = () => {
        return (
            <TasitButton identifier={"walk"} icon={WalkIcon} text={"Yürü"} onClick={() => {
                setSliderIndex(1);
            }}/>
        );
    };

    const getEshotButton = (hatNo: string, idx: number) => {
        return (
            <TasitButton key={hatNo}
                         identifier={hatNo}
                         icon={EshotIcon}
                         text={hatNo}
                         onClick={() => {
                             handleSelectLine(hatNo).then(r => r);
                             setSliderIndex(idx + 2);
                         }}
            />
        );
    };

    const getMetroButton = () => {
        if (currentStop.durak_type !== TasitTip.METRO) return;
        return (
            <TasitButton identifier={"metro"}
                         icon={MetroIcon}
                         text={"İzmir Metro"}
                         onClick={() => {
                             handleSelectIstasyon().then(r => r);
                             setSliderIndex(2);
                         }}
            />
        );
    };

    const getIzbanButton = () => {
        if (currentStop.durak_type !== TasitTip.IZBAN) return;
        return (
            <TasitButton identifier={"izban"}
                         icon={IzbanIcon}
                         text={"Banliyö"}
                         onClick={() => {
                             handleSelectIstasyon().then(r => r);
                             setSliderIndex(2);
                         }}
            />
        );
    };

    const getEshotButtons = () => {
        return availableLines.map(getEshotButton);
    };

    return (
        <section>
            <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-primary' : 'text-blue-700'}`}>Seçenekler</h3>
            <div className="grid grid-cols-2 gap-2 mb-2">
                {getWalkingButton()}
                {getMetroButton()}
                {getIzbanButton()}
                {getEshotButtons()}
            </div>
        </section>
    );
};