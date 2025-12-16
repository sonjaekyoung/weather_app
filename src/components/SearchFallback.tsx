import React, { useState } from 'react';
import { Icons } from './index';

interface SearchFallbackProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
}

const SearchFallback: React.FC<SearchFallbackProps> = ({ onSearch, isLoading }) => {
  const [city, setCity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-8 max-w-md w-full mx-auto animate-slide-up">
      <h2 className="text-xl font-bold text-gold-300 mb-6 text-center">도시 검색</h2>
      
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="도시 이름을 입력하세요 (예: 서울, Seoul)"
          className="w-full bg-charcoal-800/50 border border-gold-500/20 rounded-xl py-3 pl-4 pr-12 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-gold-500/50 transition-colors"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-gold-400 hover:text-gold-300 hover:bg-gold-500/10 transition-colors"
          aria-label="검색"
        >
          {isLoading ? <Icons.RefreshCw className="w-5 h-5 animate-spin" /> : <Icons.Search className="w-5 h-5" />}
        </button>
      </form>
      
      <p className="text-xs text-slate-500 mt-4 text-center">
        국가명이 아닌 <strong>도시 이름</strong>(예: 부에노스아이레스)으로 검색해주세요.
      </p>
    </div>
  );
};

export default SearchFallback;

