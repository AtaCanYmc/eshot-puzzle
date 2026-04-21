import type {Stop} from "../../../types/supabaseTypes";
import * as React from "react";
import LoaderOverlay from "../LoaderOverlay";
import WalkIcon from "../../../assets/svg/walk.svg";
import {sleep} from "../../../utils/commonUtils";

interface IProps {
    gameState: any;
    setGameState: React.Dispatch<React.SetStateAction<any>>;
    theme: string;
    handleWalkToStop: (stop: Stop) => void;
    nearbyStops: Stop[];
}

export const WalkingDurakOptions = (props: IProps) => {
    const {
        gameState,
        setGameState,
        theme,
        handleWalkToStop,
        nearbyStops,
    } = props;

    const [isLoading, setIsLoading] = React.useState(false);
    const [destinationStop, setDestinationStop] = React.useState<Stop | null>(null);

    const handleWalkToStopWithLoader = async (stop: Stop) => {
        setIsLoading(true);
        setDestinationStop(stop);
        try {
            await sleep(5000).then(() => handleWalkToStop(stop));
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => setGameState((prev: any) => ({
        ...prev,
        isWalking: false
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
        if (nearbyStops.length > 0) return <></>;
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
                onClick={() => handleWalkToStopWithLoader(stop)}
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
        if (nearbyStops.length === 0) return <></>;
        return nearbyStops.map(getDurakButton);
    };

    const getLoader = () => {
        if (!isLoading) return <></>;
        const message = `Durağa seyahat ediliyor: ${destinationStop ? destinationStop.durak_adi : '...'}\nLütfen bekleyin.`;
        return (
            <LoaderOverlay
                svgSrc={WalkIcon}
                text={message}
            />
        );
    };

    if (!gameState.isWalking || gameState.selectedLine) return <></>;
    return (
        <section>
            {getHeader(true, handleBack)}
            <h3 className={`text-xs font-bold uppercase tracking-widest mb-2 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'}`}>Yakındaki Duraklar</h3>
            <div className="space-y-1">
                {getDurakBulunamadi()}
                {getDurakList()}
                {getLoader()}
            </div>
        </section>
    );
};
