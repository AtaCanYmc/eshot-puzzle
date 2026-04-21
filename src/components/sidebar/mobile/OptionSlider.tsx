import WalkIcon from "../../../assets/svg/walk.svg";
import EshotIcon from "../../../assets/svg/eshot.svg";
import * as React from "react";
import {useEffect, useState} from "react";

interface IProps {
    gameState: any;
    setGameState: React.Dispatch<React.SetStateAction<any>>;
    theme: string;
    availableLines: { hat_no: string }[];
    handleSelectLine: (hatNo: string) => void;
}

export const OptionSlider = (props: IProps) => {
    const {
        gameState,
        setGameState,
        theme,
        availableLines,
        handleSelectLine
    } = props;

    const getWalkingButton = () => {
        return (
            <button className={`p-2 rounded-xl border-2 text-center group flex items-center justify-center gap-2 w-full ${gameState.isWalking ? 'bg-primary/10 border-primary text-primary font-black' : 'bg-white/5 border-primary/60 text-slate-800 hover:bg-primary/10 hover:border-primary'}`} onClick={() => {}}>
                <img src={WalkIcon} alt="Yürü" className="w-5 h-5"/>
                <span className="block text-base font-black group-hover:scale-110 transition-transform"> Yürü </span>
            </button>
        );
    };

    const getEshotButton = (hatNo: string) => {
        return (
            <button
                key={hatNo}
                onClick={() => handleSelectLine(hatNo)}
                className={`p-2 rounded-xl border-2 text-center group flex gap-2 items-center justify-center w-full
                        ${gameState.selectedLine === hatNo ? 'bg-primary/10 border-primary text-primary font-black' : 'bg-white/5 border-primary/60 text-slate-800 hover:bg-primary/10 hover:border-primary'}`}>
                <img src={EshotIcon} alt="ESHOT" className="w-5 h-5"/>
                <span className="block text-base font-black group-hover:scale-110 transition-transform">{hatNo}</span>
            </button>
        );
    };

    const eshotButtons = availableLines.map(line => getEshotButton(line.hat_no));

    // Carousel/slider için state
    const [carouselIndex, setCarouselIndex] = useState(0);
    const items = [getWalkingButton(), ...eshotButtons];
    const totalItems = items.length;

    const handlePrev = () => setCarouselIndex(i => (i - 1 + totalItems) % totalItems);
    const handleNext = () => setCarouselIndex(i => (i + 1) % totalItems);

    useEffect(() => {
        const selected = items[carouselIndex];
        if (carouselIndex === 0) {
            setGameState((prev: any) => ({
                ...prev,
                isWalking: true,
                selectedLine: null,
                selectedDirection: null,
                lineStops: []
            }))
        } else {
            const hatNo = availableLines[carouselIndex - 1].hat_no;
            handleSelectLine(hatNo);
        }
    }, [carouselIndex]);

    return (
        <div className={`w-full p-4 bg-white/10 rounded-xl ${theme === 'dark' ? 'text-slate-300' : 'text-slate-800'} mb-4`}>
            <div className="flex items-center gap-2 mb-2">
                <button onClick={handlePrev}
                        className="p-2 text-xl font-black">&#8592;</button>
                <div className="flex-1 flex justify-center">
                    {items[carouselIndex]}
                </div>
                <button onClick={handleNext}
                        className="p-2 text-xl font-black">&#8594;</button>
            </div>
        </div>
    );
};