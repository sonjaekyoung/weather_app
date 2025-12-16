import React from 'react';
import { WeatherData, UnitSystem } from '../types/weather';
import { formatTime } from '../utils/format';

interface WeatherCardProps {
  data: WeatherData;
  unit: UnitSystem;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data }) => {
  const iconUrl = `https://openweathermap.org/img/wn/${data.icon}@4x.png`;

  return (
    <div className="glass-panel rounded-3xl p-8 text-center relative overflow-hidden group">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gold-500/20 blur-[60px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        <h2 className="text-2xl font-medium text-slate-100 mb-1 flex items-center gap-2">
          {data.locationName}
          <span className="text-sm px-2 py-0.5 rounded-md bg-gold-500/20 text-gold-300 font-bold">
            {data.country}
          </span>
        </h2>
        
        <div className="my-2">
            <img 
                src={iconUrl} 
                alt={data.description} 
                className="w-32 h-32 object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.3)] animate-pulse-slow"
            />
        </div>

        <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-slate-50 to-slate-400 tracking-tighter">
          {Math.round(data.temp)}°
        </div>
        
        <p className="text-gold-300 text-lg font-medium mt-2 capitalize">
          {data.description}
        </p>
        
        <p className="text-slate-400 text-sm mt-1">
            업데이트: {formatTime(data.updatedAt / 1000)}
        </p>
      </div>
    </div>
  );
};

export default WeatherCard;

