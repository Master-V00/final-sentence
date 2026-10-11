import React from 'react';

// Full-screen entry gate: browsers require a user gesture before audio
// can start, so the player must click once here. That click unlocks
// the background music for the rest of the session.
export const EnterGate: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
  return (
    <button
      onClick={onEnter}
      aria-label="Click to enter"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md cursor-pointer group"
    >
      <span className="text-2xl md:text-4xl text-gray-100 font-bold tracking-wider animate-pulse group-hover:text-white group-hover:scale-105 transition-transform">
        click to enter...
      </span>
    </button>
  );
};
