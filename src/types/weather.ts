export interface Coordinates {
  lat: number;
  lon: number;
}

export type UnitSystem = 'metric' | 'imperial';

export interface WeatherData {
  locationName: string;
  country: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  sunrise: number; // Unix timestamp
  sunset: number;  // Unix timestamp
  updatedAt: number; // For cache validation
}

export interface WeatherError {
  code: number; // 0: Unknown, 1: Permission Denied, 2: Position Unavailable, 3: Timeout, 401: API Key, 429: Rate Limit, 404: City Not Found, 500: Server
  message: string;
  isRetryable: boolean;
}

export interface WeatherState {
  status: 'idle' | 'requesting-location' | 'loading-weather' | 'success' | 'error';
  data: WeatherData | null;
  error: WeatherError | null;
  unit: UnitSystem;
}

