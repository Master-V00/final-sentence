
import React, { useState } from 'react';
import { toggleMusic } from '../services/soundService';

export const MusicToggle: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);

  const handleToggle = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    toggleMusic(newState);
  };

  return (
    <button 
      onClick={handleToggle}
      className="fixed top-4 right-4 z-[100] flex items-center justify-center bg-green-900/80 border border-green-500/50 rounded-full h-12 w-12 hover:bg-green-800/80 transition-all duration-300 shadow-[0_0_15px_rgba(0,255,0,0.3)] backdrop-blur-sm group"
      aria-label={isMuted ? "Unmute Music" : "Mute Music"}
    >
      {isMuted ? (
        // Muted Icon
        <svg className="w-6 h-6 text-green-400 opacity-60 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        </svg>
      ) : (
        // Music Note Icon
        <svg className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      )}
    </button>
  );
};
