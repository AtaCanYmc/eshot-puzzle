import type {Stop} from "../../../types/supabaseTypes";
import * as React from "react";
import LoaderOverlay from "../LoaderOverlay";
import EshotIcon from "../../../assets/svg/eshot.svg";
import {sleep} from "../../../utils/commonUtils";
import { playSound } from '../../../utils/audioUtils';
import eshotSound from '../../../assets/sound/eshot-travel-sound.mp3';

interface IProps {
    gameState: any;
    setGameState: React.Dispatch<React.SetStateAction<any>>;
    theme: string;
    handleTravelToStop: (stop: Stop) => void;
}

export const EshotDurakOptions = (props: IProps) => {
    const {
        gameState,
        setGameState,
        theme,
        handleTravelToStop
    } = props;

    const [isLoading, setIsLoading] = React.useState(false);
    const [destinationStop, setDestinationStop] = React.useState<Stop | null>(null);

    const handleTravelToStopWithLoader = async (stop: Stop) => {
        setIsLoading(true);
        setDestinationStop(stop);
        const sound = playSound(eshotSound);
        try {
            const durationMs = sound.duration() * 1000;
            await sleep(durationMs);
            handleTravelToStop(stop);
        } finally {
            setIsLoading(false);
            sound.stop();
        }
    };

    const handleBack = () => setGameState((prev: any) => ({
        ...prev,
        selectedLine: null,
        selectedDirection: null,
        lineStops: []
    }));

    const getHeader = (showBackButton = false, onBack?: () => void) => {
        return (
            <header className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className={`text-xs font-black uppercase tracking-widest mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Şu
                        Anki Durak</h2>
                    <p className={`text-lg font-bold leading-tight line-clamp-2 ${theme === 'dark' ? '' : 'text-slate-900'}`}>{gameState.currentStop.durak_adi}</p>
                    <span className="text-xs font-mono text-primary opacity-70">{gameState.currentStop.durak_id}</span>
                </div>
                {showBackButton && (
                    <button
                        onClick={onBack}
                        className="text-sm font-extrabold text-slate-400 hover:text-primary underline px-2 py-1 transition-colors"
                    >GERİ</button>
                )}
            </header>
        );
    };

    const getDurakBulunamadi = () => {
        if (gameState.lineStops.length > 0) return <></>;
        return (
            <div className={`text-xs italic ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                Hatta ait durak bulunamadı.
            </div>
        );
    };

    const getDurakButton = (stop: Stop) => {
        if (stop.status_code === 0) return null;
        const isCurrent = stop.status_code === 2;

        return (
            <button
                key={stop.durak_id}
                onClick={() => handleTravelToStopWithLoader(stop)}
                className={`w-full p-2 rounded-xl text-left border flex items-center gap-2 transition-all
                        ${isCurrent ? 'bg-green-100 border-green-500 text-green-700 font-black' : 'bg-primary/10 border-primary text-primary hover:bg-primary/20'}`}
            >
                                            <span
                                                className={`w-2 h-2 rounded-full shrink-0 ${isCurrent ? 'bg-green-500' : 'bg-primary'}`}></span>
                <span className="flex flex-col">
                        <span className="text-xs font-semibold truncate">{stop.durak_adi}</span>
                        <span className="text-[10px] font-mono text-primary opacity-70">{stop.durak_id}</span>
                      </span>
            </button>
        );
    };

    const getDurakList = () => {
        if (gameState.lineStops.length === 0) return <></>;
        return gameState.lineStops.map(getDurakButton);
    };

    const getLoader = () => {
        if (!isLoading) return <></>;
        const message = `Durağa seyahat ediliyor: ${destinationStop ? destinationStop.durak_adi : '...'}\nLütfen bekleyin.`;
        return (
            <LoaderOverlay
                svgSrc={EshotIcon}
                text={message}
            />
        );
    };

    if (!gameState.selectedLine || gameState.isWalking) return <></>;
    return (
        <section>
            {getHeader(true, handleBack)}
            <h3 className={`text-xs font-bold uppercase tracking-widest mb-2 ${theme === 'dark' ? 'text-primary' : 'text-blue-700'}`}>Hat
                Durakları</h3>
            <div className="space-y-1">
                {getDurakBulunamadi()}
                {getDurakList()}
                {getLoader()}
            </div>
        </section>
    );
};
