import axios, { AxiosError } from 'axios';
import { Coordinates, UnitSystem, WeatherData, WeatherError } from '../types/weather';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const CACHE_KEY_PREFIX = 'weather_cache_';
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes cache

// Helper to check cache validity
const getCachedData = (key: string): WeatherData | null => {
  try {
    const item = localStorage.getItem(CACHE_KEY_PREFIX + key);
    if (!item) return null;

    const parsed: WeatherData = JSON.parse(item);
    const now = Date.now();
    
    // Cache expired
    if (now - parsed.updatedAt > CACHE_DURATION_MS) {
      localStorage.removeItem(CACHE_KEY_PREFIX + key);
      return null;
    }
    
    return parsed;
  } catch (e) {
    return null;
  }
};

const setCachedData = (key: string, data: WeatherData) => {
  try {
    localStorage.setItem(CACHE_KEY_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage quota exceeded');
  }
};

const mapResponseToData = (data: any): WeatherData => {
  return {
    locationName: data.name,
    country: data.sys.country,
    temp: data.main.temp,
    feelsLike: data.main.feels_like,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
    updatedAt: Date.now(),
  };
};

export const fetchWeatherByCoords = async (
  { lat, lon }: Coordinates,
  unit: UnitSystem
): Promise<WeatherData> => {
  const cacheKey = `lat_${lat.toFixed(2)}_lon_${lon.toFixed(2)}_${unit}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  if (!API_KEY) {
    throw { code: 401, message: 'API Key is missing via .env', isRetryable: false };
  }

  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        units: unit,
        appid: API_KEY,
        lang: 'kr',
      },
    });

    const weatherData = mapResponseToData(response.data);
    setCachedData(cacheKey, weatherData);
    return weatherData;
  } catch (error) {
    throw handleApiError(error);
  }
};

const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// ... existing code ...

export const fetchWeatherByCity = async (
  city: string,
  unit: UnitSystem
): Promise<WeatherData> => {
  // 캐시는 도시 이름으로 유지하되, 내부적으로는 좌표를 찾아 날씨를 가져옴
  const cacheKey = `city_${city.toLowerCase()}_${unit}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  if (!API_KEY) {
    throw { code: 401, message: 'API Key is missing via .env', isRetryable: false };
  }

  // Helper: Geocoding API 호출
  const findCoordinates = async (query: string) => {
    const response = await axios.get(`${GEO_URL}/direct`, {
      params: {
        q: query,
        limit: 1,
        appid: API_KEY,
      },
    });
    return response.data;
  };

  try {
    let geoData = [];
    
    // 1차 시도: 입력 그대로 검색
    geoData = await findCoordinates(city);

    // 2차 시도: 한글이고 결과가 없으면 '시' 붙여서 재검색
    if (geoData.length === 0) {
       const isKorean = /[가-힣]/.test(city);
       if (isKorean && !city.endsWith('시') && !city.endsWith('군') && !city.endsWith('구')) {
          geoData = await findCoordinates(city + '시');
       }
    }
    
    // 3차 시도: 그래도 없으면 영문 변환 시도보다는 에러 처리 (Geocoding API가 꽤 강력함)
    // 만약 '부에노스아이레스' 같은 경우 Geocoding API는 한글 쿼리도 꽤 잘 처리하지만, 
    // 그래도 안되면 사용자가 영문으로 입력하게 유도.

    if (geoData.length === 0) {
      // 404 에러 시뮬레이션
      throw { response: { status: 404 } };
    }

    const { lat, lon } = geoData[0];
    
    // 좌표로 날씨 조회 (기존 함수 활용)
    // 주의: fetchWeatherByCoords 내부에서 캐싱을 또 하므로, 여기서는 결과만 받아서 리턴
    // 하지만 상위 캐시(city_...)를 위해 데이터는 필요함.
    const weatherResponse = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        units: unit,
        appid: API_KEY,
        lang: 'kr',
      },
    });

    const weatherData = mapResponseToData(weatherResponse.data);
    
    // 검색된 도시 이름이 API 결과(영어일 수 있음)와 다를 수 있으므로, 
    // 사용자 입력에 가깝거나 Geo API의 로컬 네임을 쓸 수도 있으나, 
    // 일단 Weather API가 주는 표준 이름을 사용.
    
    setCachedData(cacheKey, weatherData);
    return weatherData;

  } catch (error) {
    throw handleApiError(error);
  }
};

const handleApiError = (error: any): WeatherError => {
  if (axios.isAxiosError(error) && error.response) {
    const status = error.response.status;
    if (status === 401) return { code: 401, message: 'API 키가 유효하지 않습니다.', isRetryable: false };
    if (status === 404) return { code: 404, message: '도시를 찾을 수 없습니다. 올바른 도시 이름을 입력해주세요.', isRetryable: true };
    if (status === 429) return { code: 429, message: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.', isRetryable: true };
    if (status >= 500) return { code: 500, message: '날씨 서비스에 오류가 발생했습니다.', isRetryable: true };
  }
  return { code: 0, message: '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.', isRetryable: true };
};

