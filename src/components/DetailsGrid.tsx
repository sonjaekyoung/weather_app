import React from 'react';
import { WeatherData, UnitSystem } from '../types/weather';
import { Icons } from './index';
import { formatTime } from '../utils/format';

interface DetailsGridProps {
  data: WeatherData;
  unit: UnitSystem;
}

const DetailItem: React.FC<{ icon: React.ElementType; label: string; value: string | number }> = ({ icon: Icon, label, value }) => (
  <div className="bg-charcoal-800/30 rounded-xl p-4 flex flex-col items-center justify-center border border-slate-700/30 hover:border-gold-500/20 transition-colors group">
    <Icon className="w-5 h-5 text-gold-500 mb-2 group-hover:scale-110 transition-transform" />
    <span className="text-slate-400 text-xs uppercase tracking-wider mb-1">{label}</span>
    <span className="text-slate-200 font-semibold">{value}</span>
  </div>
);

const DetailsGrid: React.FC<DetailsGridProps> = ({ data, unit }) => {
  const speedUnit = unit === 'metric' ? 'm/s' : 'mph';

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 w-full">
      <DetailItem 
        icon={Icons.Thermometer} 
        label="체감 온도" 
        value={`${Math.round(data.feelsLike)}°`} 
      />
      <DetailItem 
        icon={Icons.Droplets} 
        label="습도" 
        value={`${data.humidity}%`} 
      />
      <DetailItem 
        icon={Icons.Wind} 
        label="바람" 
        value={`${data.windSpeed} ${speedUnit}`} 
      />
      <DetailItem 
        icon={Icons.Sunrise} 
        label="일출" 
        value={formatTime(data.sunrise)} 
      />
    </div>
  );
};

export default DetailsGrid;

