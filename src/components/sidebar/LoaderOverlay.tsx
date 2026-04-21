import React from 'react';

interface LoaderOverlayProps {
  svgSrc: string;
  text?: string;
}

const LoaderOverlay: React.FC<LoaderOverlayProps> = ({ svgSrc, text }) => (
  <div className="fixed inset-0 z-[2000] flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
    <img
      src={svgSrc}
      alt="Yükleniyor"
      className="w-16 h-16 animate-spin-slow mb-4"
      style={{ animation: 'spin 1.5s linear infinite' }}
    />
    {text && <span className="text-white text-lg font-bold drop-shadow-lg">{text}</span>}
    <style>{`
      @keyframes spin { 100% { transform: rotate(360deg); } }
      .animate-spin-slow { animation: spin 1.5s linear infinite; }
    `}</style>
  </div>
);

export default LoaderOverlay;

