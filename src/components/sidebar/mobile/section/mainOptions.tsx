import WalkIcon from "../../../../assets/svg/walk.svg";
import EshotIcon from "../../../../assets/svg/eshot.svg";
import * as React from "react";
import {useCommonTravel} from "../../../../hooks/useCommonTravel";
import {useGameStore} from "../../../../store/gameStore";
import {TasitButton} from "../../../button/TasitButton";

interface IProps {
    theme: string;
}

export const MainOptions = (props: IProps) => {
    const {theme} = props;
    const {handleSelectLine} = useCommonTravel();
    const {
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
            <TasitButton identifier={hatNo} icon={EshotIcon} text={hatNo} onClick={() => {
                handleSelectLine(hatNo).then(r => r);
                setSliderIndex(idx + 2);
            }}/>
        );
    };

    const getEshotButtons = () => {
        return availableLines.map(getEshotButton);
    };

    return (
        <section>
            <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-primary' : 'text-blue-700'}`}>Geçen
                Hatlar</h3>
            <div className="grid grid-cols-2 gap-2 mb-2">
                {getWalkingButton()}
                {getEshotButtons()}
            </div>
        </section>
    );
};