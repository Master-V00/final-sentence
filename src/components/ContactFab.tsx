
import React from 'react';

export const ContactFab: React.FC = () => {
  return (
    <a 
      href="https://discord.com/users/1311805317025366081"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-[100] flex items-center bg-green-900/80 border border-green-500/50 rounded-full h-12 w-12 hover:w-auto overflow-hidden transition-all duration-300 group shadow-[0_0_15px_rgba(0,255,0,0.3)] backdrop-blur-sm"
    >
      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-green-400 font-bold text-xl font-dossier">
        V
      </div>
      <div className="whitespace-nowrap px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-green-100 text-sm font-mono delay-100 hidden group-hover:block">
        To add your grade level, contact me.
      </div>
    </a>
  );
};
