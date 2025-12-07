import React, { useState } from 'react';
import { PatientProfile, Intervention } from '../../types';

interface Props {
  profile: PatientProfile;
  intervention: Intervention;
}

const VisionTab: React.FC<Props> = ({ profile, intervention }) => {
  const [mode, setMode] = useState<'current' | 'future'>('current');

  // Logic to calculate visual impairment based on HbA1c
  // HbA1c > 7 is generally considered high risk.
  const getVisualEffects = (hba1c: number) => {
    const baseline = 6.0; // Normalish threshold
    const severity = Math.max(0, hba1c - baseline);
    
    return {
      blur: severity * 1.5, // px
      brightness: 100 - (severity * 5), // %
      contrast: 100 + (severity * 5), // %
      spots: severity > 2 ? Math.floor((severity - 1.5) * 4) : 0, // number of scotoma spots
      spotOpacity: Math.min(0.8, severity * 0.15)
    };
  };

  // Estimate effective HbA1c for the counterfactual scenario
  // A rough heuristic: HbA1c approx = (Average Glucose + 2.59) / 1.59 (Glucose in mmol/L)
  // We estimate the 'future' HbA1c based on the target glucose intervention.
  const estimatedFutureHbA1c = (intervention.targetGlucose + 2.6) / 1.6;

  const currentHbA1c = profile.hba1c;
  const effectiveHbA1c = mode === 'current' ? currentHbA1c : estimatedFutureHbA1c;

  const effects = getVisualEffects(effectiveHbA1c);

  const containerStyle: React.CSSProperties = {
    filter: `blur(${effects.blur}px) brightness(${effects.brightness}%) contrast(${effects.contrast}%)`,
    transition: 'filter 1s ease-in-out',
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  };

  // Generate spots (scotoma) based on severity
  const renderSpots = () => {
    const spots = [];
    // We use a deterministic approach based on index so spots don't jump around too wildly
    for (let i = 0; i < effects.spots; i++) {
      // Pseudo-random positions based on index
      const top = Math.abs(Math.sin(i * 123.45)) * 80 + 10; 
      const left = Math.abs(Math.cos(i * 678.90)) * 80 + 10;
      const size = 30 + Math.abs(Math.sin(i)) * 50;
      
      spots.push(
        <div 
          key={i}
          style={{
            position: 'absolute',
            top: `${top}%`,
            left: `${left}%`,
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: 'black',
            borderRadius: '50%',
            filter: 'blur(12px)',
            opacity: effects.spotOpacity,
            pointerEvents: 'none',
            transition: 'opacity 1s ease'
          }}
        />
      );
    }
    return spots;
  };

  return (
    <div className="h-full flex flex-col">
       <div className="flex justify-between items-center mb-4">
         <div>
           <h3 className="text-lg font-bold text-slate-800">Симуляция Зрения (Ретинопатия)</h3>
           <p className="text-sm text-slate-500">
             Эффективный HbA1c: <span className={effectiveHbA1c > 7 ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
               {effectiveHbA1c.toFixed(1)}%
             </span>
           </p>
         </div>
         
         <div className="flex bg-slate-100 p-1 rounded-lg">
           <button
             onClick={() => setMode('current')}
             className={`px-4 py-2 text-sm rounded-md transition ${mode === 'current' ? 'bg-white shadow text-blue-700 font-medium' : 'text-slate-500 hover:text-slate-700'}`}
           >
             Текущее
           </button>
           <button
             onClick={() => setMode('future')}
             className={`px-4 py-2 text-sm rounded-md transition ${mode === 'future' ? 'bg-white shadow text-green-700 font-medium' : 'text-slate-500 hover:text-slate-700'}`}
           >
             Прогноз
           </button>
         </div>
       </div>

       <div className="relative flex-grow rounded-xl overflow-hidden bg-black shadow-inner border border-slate-200 min-h-[300px]">
         {/* Background Image - Using a clear landscape from Unsplash */}
         <img 
           src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
           alt="Visual Simulation"
           style={containerStyle}
         />
         
         {/* Overlay Layer for spots */}
         <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {renderSpots()}
         </div>
         
         {/* Label overlay */}
         <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm">
           {mode === 'current' ? 'Текущее восприятие' : 'Восприятие после терапии'}
         </div>
       </div>

       <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-sm rounded-lg border border-blue-100">
         ℹ️ <strong>Медицинская справка:</strong> Высокий уровень сахара повреждает сосуды сетчатки, вызывая диабетическую ретинопатию. Это может приводить к размытости ("туман"), появлению темных пятен (скотом) и снижению контрастности. Стабилизация глюкозы предотвращает прогрессирование.
       </div>
    </div>
  );
};

export default VisionTab;