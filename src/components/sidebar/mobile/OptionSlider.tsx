import WalkIcon from "../../../assets/svg/walk.svg";
import MapIcon from "../../../assets/svg/map.svg";
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
        setGameState,
        theme,
        availableLines,
        handleSelectLine
    } = props;

    const getMapButton = () => {
        return (
            <button className={`p-2 rounded-xl border-2 text-center group flex items-center justify-center gap-2 w-full bg-primary/10 border-primary text-primary font-black`} onClick={() => {}}>
                <img src={MapIcon} alt="Harita" className="w-5 h-5"/>
                <span className="block text-base font-black group-hover:scale-110 transition-transform"> Harita Kullan </span>
            </button>
        );
    };

    const getWalkingButton = () => {
        return (
            <button className={`p-2 rounded-xl border-2 text-center group flex items-center justify-center gap-2 w-full bg-primary/10 border-primary text-primary font-black`} onClick={() => {}}>
                <img src={WalkIcon} alt="Yürü" className="w-5 h-5"/>
                <span className="block text-base font-black group-hover:scale-110 transition-transform"> Yürü </span>
            </button>
        );
    };

    const getEshotButton = (hatNo: string) => {
        return (
            <button
                key={hatNo}
                onClick={() => {}}
                className={`p-2 rounded-xl border-2 text-center group flex gap-2 items-center justify-center w-full bg-primary/10 border-primary text-primary font-black`}>
                <img src={EshotIcon} alt="ESHOT" className="w-5 h-5"/>
                <span className="block text-base font-black group-hover:scale-110 transition-transform">{hatNo}</span>
            </button>
        );
    };

    const eshotButtons = availableLines.map(line => getEshotButton(line.hat_no));

    // Carousel/slider için state
    const [carouselIndex, setCarouselIndex] = useState(0);
    const items = [getMapButton(), getWalkingButton(), ...eshotButtons];
    const totalItems = items.length;

    const handlePrev = () => setCarouselIndex(i => (i - 1 + totalItems) % totalItems);
    const handleNext = () => setCarouselIndex(i => (i + 1) % totalItems);

    useEffect(() => {
        if (carouselIndex === 0) {
            setGameState((prev: any) => ({
                ...prev,
                isWalking: false,
                selectedLine: null,
                selectedDirection: null,
                lineStops: []
            }))
        } else if (carouselIndex === 1) {
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
        <div className={`w-full p-4 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-800'}`}>
            <div className="flex items-center gap-2">
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