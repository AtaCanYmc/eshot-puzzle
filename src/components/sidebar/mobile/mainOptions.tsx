import WalkIcon from "../../../assets/svg/walk.svg";
import EshotIcon from "../../../assets/svg/eshot.svg";
import * as React from "react";

interface IProps {
    gameState: any;
    setGameState: React.Dispatch<React.SetStateAction<any>>;
    theme: string;
    availableLines: { hat_no: string }[];
    handleSelectLine: (hatNo: string) => void;
}

export const MainOptions = (props: IProps) => {
    const {
        gameState,
        setGameState,
        theme,
        availableLines,
        handleSelectLine
    } = props;

    const getWalkingButton = () => {
        return (
            <button
                className={`p-2 rounded-xl border-2 text-center group flex items-center justify-center gap-2`}
                onClick={() => setGameState((prev: any) => ({
                    ...prev,
                    isWalking: !prev.isWalking,
                    selectedLine: null,
                    selectedDirection: null,
                    lineStops: []
                }))}
            >
                <img src={WalkIcon} alt="Yürü" className="w-5 h-5"/>
                <span
                    className="block text-base font-black group-hover:scale-110 transition-transform"> Yürü </span>
            </button>
        );
    };

    const getEshotButton = (hatNo: string) => {
        return (
            <button
                key={hatNo}
                onClick={() => handleSelectLine(hatNo)}
                className={`p-2 rounded-xl border-2 text-center group flex gap-2 items-center justify-center`}>
                <img src={EshotIcon} alt="ESHOT" className="w-5 h-5"/>
                <span className="block text-base font-black group-hover:scale-110 transition-transform">{hatNo}</span>
            </button>
        );
    };

    const getEshotButtons = () => {
      return availableLines.map(line => getEshotButton(line.hat_no));
    };

    if (gameState.selectedLine || gameState.isWalking) return <></>;
    return (
        <section>
            <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-primary' : 'text-blue-700'}`}>Geçen Hatlar</h3>
            <div className="grid grid-cols-2 gap-2 mb-2">
                {getWalkingButton()}
                {getEshotButtons()}
            </div>
        </section>
    );
};