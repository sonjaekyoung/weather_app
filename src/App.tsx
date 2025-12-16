import { useState } from 'react';
import { useWeather } from './hooks/useWeather';
import { 
  Header, 
  PermissionCard, 
  WeatherCard, 
  DetailsGrid, 
  SearchFallback, 
  UnitToggle,
  Icons
} from './components';

function App() {
  const { 
    status, 
    data, 
    error, 
    unit, 
    requestLocation, 
    searchCity, 
    setUnit,
    retry 
  } = useWeather();
  
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (city: string) => {
    searchCity(city);
    setIsSearching(false);
  };

  // Handle Logic based on status
  const renderContent = () => {
    // 1. Loading State (Generic)
    if (status === 'requesting-location' || status === 'loading-weather') {
      return (
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gold-500">
              <Icons.Cloud className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-gold-200 text-lg font-medium animate-pulse">
            {status === 'requesting-location' ? '위치 정보 확인 중...' : '날씨 정보 불러오는 중...'}
          </p>
        </div>
      );
    }

    // 1.5 Manual Search Mode
    if (isSearching) {
      return (
        <div className="space-y-4">
          <SearchFallback onSearch={handleSearch} isLoading={false} />
          <button 
             onClick={() => setIsSearching(false)}
             className="w-full py-2 text-slate-400 hover:text-slate-200 transition-colors text-sm"
          >
             취소
          </button>
        </div>
      );
    }

    // 2. Initial Permission Request
    if (status === 'idle') {
      return <PermissionCard onRequest={requestLocation} isLoading={false} />;
    }

    // 3. Permission Denied OR Location Error (Timeout/Unavailable) -> Show Search Fallback
    // Code 1: Denied, 2: Unavailable, 3: Timeout
    if (status === 'error' && error) {
      // Forcefully cast error.code to number to satisfy TypeScript compiler (even though it IS a number)
      // Sometimes TypeScript narrows types too aggressively.
      const errCode = (error as any).code;
      if (errCode === 1 || errCode === 2 || errCode === 3) {
      return (
        <div className="space-y-6">
           {/* Show error message gently above the search box */}
           <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-slide-up">
              <Icons.MapPin className="w-4 h-4 text-red-400" />
              <span>{error.message}</span>
           </div>
           
           <SearchFallback onSearch={searchCity} isLoading={status === 'loading-weather'} />
        </div>
      );
      }
    }

    // 4. API Error / Other Errors
    if (status === 'error') {
      return (
        <div className="glass-panel rounded-2xl p-8 text-center max-w-md mx-auto animate-slide-up">
          <div className="bg-red-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icons.Cloud className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-red-400 mb-2">오류 발생</h3>
          <p className="text-slate-400 mb-6">{error?.message}</p>
          
          <div className="flex flex-col gap-3 justify-center">
             {error?.isRetryable && (
                <button
                    onClick={retry}
                    className="w-full px-6 py-3 rounded-lg bg-gold-600 hover:bg-gold-500 text-charcoal-950 font-bold transition-colors"
                >
                    재시도
                </button>
             )}
             
             <button 
               onClick={() => window.location.reload()} 
               className="w-full px-6 py-3 rounded-lg border border-gold-500/30 text-gold-300 hover:bg-gold-500/10 transition-colors"
             >
               초기화
             </button>
          </div>
        </div>
      );
    }

    // 5. Success Data
    if (status === 'success' && data) {
      return (
        <div className="w-full max-w-md mx-auto space-y-6 animate-slide-up">
          <div className="flex justify-end">
            <UnitToggle unit={unit} onToggle={setUnit} />
          </div>
          
          <WeatherCard data={data} unit={unit} />
          <DetailsGrid data={data} unit={unit} />

          <button 
             onClick={() => setIsSearching(true)}
             className="w-full mt-8 py-3 rounded-xl border border-gold-500/20 text-gold-400 hover:bg-gold-500/10 hover:text-gold-300 transition-colors flex items-center justify-center gap-2 text-sm"
          >
             <Icons.RefreshCw className="w-4 h-4" />
             다른 지역 검색
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="relative min-h-screen bg-charcoal-950 overflow-hidden flex flex-col items-center px-4 py-8">
      {/* Background Effects Layer (Fixed for all pages) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Deep Night Sky Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#312e81]" />
        
        {/* Aurora / Flowing Effects - Increased visibility */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[100px] animate-drift-slow mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-violet-600/20 rounded-full blur-[100px] animate-drift-medium mix-blend-screen" />
        <div className="absolute top-[40%] left-[30%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse-slow mix-blend-screen" />
        
        {/* Twinkling Stars */}
        <div className="absolute top-[15%] left-[15%] w-1 h-1 bg-white rounded-full animate-twinkle shadow-[0_0_8px_rgba(255,255,255,0.8)]" style={{ animationDelay: '0s' }} />
        <div className="absolute top-[25%] left-[85%] w-1.5 h-1.5 bg-gold-200 rounded-full animate-twinkle shadow-[0_0_10px_rgba(255,215,0,0.6)]" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-[65%] left-[10%] w-1 h-1 bg-white rounded-full animate-twinkle shadow-[0_0_8px_rgba(255,255,255,0.8)]" style={{ animationDelay: '2.3s' }} />
        <div className="absolute bottom-[20%] right-[20%] w-1 h-1 bg-blue-200 rounded-full animate-twinkle shadow-[0_0_8px_rgba(100,200,255,0.8)]" style={{ animationDelay: '0.8s' }} />
        <div className="absolute top-[10%] right-[30%] w-0.5 h-0.5 bg-white rounded-full animate-twinkle" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-[40%] left-[40%] w-0.5 h-0.5 bg-gold-100 rounded-full animate-twinkle" style={{ animationDelay: '1.2s' }} />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 w-full max-w-md flex flex-col flex-grow">
        <Header />
        <main className="mt-8 w-full flex-grow">
          {renderContent()}
        </main>
      </div>
      
      <footer className="relative z-10 mt-auto py-6 text-center text-slate-400 text-xs">
        <p>&copy; 2024 Gild Weather. Data by OpenWeather.</p>
      </footer>
    </div>
  );
}

export default App;
