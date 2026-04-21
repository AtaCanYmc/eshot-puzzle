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

    if (gameState.selectedLine || gameState.isWalking) return <></>;
    return (
        <section>
            <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-primary' : 'text-blue-700'}`}>Geçen
                Hatlar</h3>
            <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                    className={`p-2 rounded-xl border-2 text-center group col-span-2 flex items-center justify-center gap-2 ${gameState.isWalking ? 'bg-yellow-100 text-slate-800 font-black' : 'bg-white/5 text-slate-800 hover:bg-yellow-50'}`}
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
            </div>
            <div className="grid grid-cols-2 gap-2">
                {availableLines.length > 0 ? (
                    availableLines.map(line => (
                        <button
                            key={line.hat_no}
                            onClick={() => handleSelectLine(line.hat_no)}
                            className={`p-2 rounded-xl border-2 text-center group flex gap-2 items-center justify-center
                        ${gameState.selectedLine === line.hat_no
                                ? 'bg-primary/10 border-primary text-primary font-black'
                                : 'bg-white/5 border-primary/60 text-slate-800 hover:bg-primary/10 hover:border-primary'}
                      `}
                        >
                            <img src={EshotIcon} alt="ESHOT" className="w-5 h-5"/>
                            <span
                                className="block text-base font-black group-hover:scale-110 transition-transform">{line.hat_no}</span>
                        </button>
                    ))
                ) : (
                    <p className={`col-span-2 text-xs italic py-2 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Bu
                        durakta hat bulunamadı.</p>
                )}
            </div>
        </section>
    );
};