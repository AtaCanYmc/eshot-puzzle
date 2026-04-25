import React from 'react';
import LoadIcon from "../../assets/react.svg";

interface LoaderOverlayProps {
  svgSrc: string | null;
  text?: string;
}

const LoaderOverlay: React.FC<LoaderOverlayProps> = ({ svgSrc, text }) => (
  <div className="fixed inset-0 z-[2000] flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm text-center">
    <img
      src={svgSrc ?? LoadIcon}
      alt="Yükleniyor"
      className="w-16 h-16 animate-blink-smooth mb-4"
      style={{ animation: 'blink-smooth 1.2s linear infinite' }}
    />
    {text && (
      <span className="text-white text-lg font-bold drop-shadow-lg text-center whitespace-pre-line flex items-center justify-center w-full">
        {text}
      </span>
    )}
    <style>{`
      @keyframes blink-smooth {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      .animate-blink-smooth { animation: blink-smooth 1.2s linear infinite; }
    `}</style>
  </div>
);

export default LoaderOverlay;
