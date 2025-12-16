import React from 'react';
import { Icons } from './index';

interface PermissionCardProps {
  onRequest: () => void;
  isLoading: boolean;
}

const PermissionCard: React.FC<PermissionCardProps> = ({ onRequest, isLoading }) => {
  return (
    <div className="glass-panel rounded-2xl p-8 max-w-md w-full mx-auto text-center animate-slide-up">
      <div className="bg-gold-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icons.MapPin className="w-8 h-8 text-gold-400" />
      </div>
      
      <h2 className="text-2xl font-bold text-slate-100 mb-2">위치 정보 허용</h2>
      <p className="text-slate-400 mb-8">
        정확한 날씨 정보를 제공하기 위해<br/>현재 위치 접근 권한이 필요합니다.
      </p>

      <button
        onClick={onRequest}
        disabled={isLoading}
        className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-charcoal-950 font-bold transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gold-500/20"
      >
        {isLoading ? '위치 확인 중...' : '지금 바로 날씨 확인하기'}
      </button>
    </div>
  );
};

export default PermissionCard;

