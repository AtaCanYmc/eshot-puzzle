import * as React from "react";
import {useGameStore} from "../../../../store/gameStore";
import WalkIcon from "../../../../assets/svg/walk.svg";
import {TasitButton} from "../../../button/TasitButton";

interface IProps {
    theme: string;
}

export const OptionSlider = (props: IProps) => {
    const {theme} = props;
    const {
        sliderIndex,
        setSliderIndex,
        availableLines
    } = useGameStore();

    const items = [
        <TasitButton key={'walk'} icon={WalkIcon} text={'Yürü'}/>
    ]

    const handlePrev = () => {
        setSliderIndex((sliderIndex - 1 + items.length) % items.length);
    };

    const handleNext = () => {
        setSliderIndex((sliderIndex + 1 + items.length) % items.length);
    };

    return (
        <div className={`w-full p-4 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-800'}`}>
            <div className="flex items-center gap-2">
                <button onClick={handlePrev} className="p-2 text-xl font-black">&#8592;</button>
                <div className="flex-1 flex justify-center">{items[sliderIndex]}</div>
                <button onClick={handleNext} className="p-2 text-xl font-black">&#8594;</button>
            </div>
        </div>
    );
};