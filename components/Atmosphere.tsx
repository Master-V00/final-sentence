
import React from 'react';

interface AtmosphereProps {
  intensity: number; // 0 to 1
}

export const Atmosphere: React.FC<AtmosphereProps> = ({ intensity }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Vignette */}
      <div 
        className="absolute inset-0 bg-radial-gradient transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, transparent 40%, rgba(0,0,0,${0.5 + (intensity * 0.5)}) 90%)`
        }}
      />

      {/* Noise/Grain */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
           }}
      />

      {/* Scanlines */}
      <div className="absolute inset-0 scanline opacity-20"></div>
      
      {/* Red tint when intensity is high (stress) */}
      <div 
        className="absolute inset-0 bg-red-900 mix-blend-multiply transition-opacity duration-500"
        style={{ opacity: intensity > 0.8 ? (intensity - 0.8) * 2 : 0 }}
      />
    </div>
  );
};
