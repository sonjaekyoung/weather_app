import React from 'react';
import { UnitSystem } from '../types/weather';

interface UnitToggleProps {
  unit: UnitSystem;
  onToggle: (unit: UnitSystem) => void;
}

const UnitToggle: React.FC<UnitToggleProps> = ({ unit, onToggle }) => {
  return (
    <div className="flex bg-charcoal-900 rounded-lg p-1 border border-slate-700/50">
      <button
        onClick={() => onToggle('metric')}
        className={`px-3 py-1 text-sm rounded-md transition-all ${
          unit === 'metric' 
            ? 'bg-gold-500 text-charcoal-950 font-bold shadow-lg shadow-gold-500/20' 
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        °C
      </button>
      <button
        onClick={() => onToggle('imperial')}
        className={`px-3 py-1 text-sm rounded-md transition-all ${
          unit === 'imperial' 
            ? 'bg-gold-500 text-charcoal-950 font-bold shadow-lg shadow-gold-500/20' 
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        °F
      </button>
    </div>
  );
};

export default UnitToggle;

