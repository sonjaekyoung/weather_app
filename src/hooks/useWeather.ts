import { useState, useEffect, useCallback } from 'react';
import { WeatherState, UnitSystem, Coordinates, WeatherError } from '../types/weather';
import * as api from '../services/api';

export const useWeather = () => {
  const [state, setState] = useState<WeatherState>({
    status: 'idle',
    data: null,
    error: null,
    unit: 'metric',
  });

  // Helper to update partial state
  const updateState = (updates: Partial<WeatherState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const setUnit = useCallback((unit: UnitSystem) => {
    updateState({ unit });
    // If we already have data, we trigger a re-fetch logic handled by effect or manual trigger
    // For simplicity, we just update unit. In a real app, we might want to convert locally or refetch.
    // Let's assume we want to refetch on unit change if we have a location context (saved in ref/state).
  }, []);

  // --- Geolocation Logic ---
  const requestLocation = useCallback(() => {
    updateState({ status: 'requesting-location', error: null });

    if (!navigator.geolocation) {
      updateState({
        status: 'error',
        error: { code: 0, message: 'Geolocation is not supported by this browser.', isRetryable: false }
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeatherByCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (error) => {
        let errorMsg = 'Unknown location error.';
        let code = 0;
        
        switch(error.code) {
            case error.PERMISSION_DENIED:
                errorMsg = 'Location permission denied. Please search for a city.';
                code = 1; 
                break;
            case error.POSITION_UNAVAILABLE:
                errorMsg = 'Location information is unavailable.';
                code = 2;
                break;
            case error.TIMEOUT:
                errorMsg = 'The request to get user location timed out.';
                code = 3;
                break;
        }
        updateState({ 
            status: 'error', 
            error: { code, message: errorMsg, isRetryable: code !== 1 } 
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000, // Increased to 15s
        maximumAge: 60000
      }
    );
  }, [state.unit]);

  // --- API Logic ---
  const fetchWeatherByCoords = async (coords: Coordinates) => {
    updateState({ status: 'loading-weather', error: null });
    try {
      const data = await api.fetchWeatherByCoords(coords, state.unit);
      updateState({ status: 'success', data, error: null });
    } catch (e) {
      const error = e as WeatherError;
      updateState({ status: 'error', error });
    }
  };

  const fetchWeatherByCity = async (city: string) => {
    updateState({ status: 'loading-weather', error: null });
    try {
      const data = await api.fetchWeatherByCity(city, state.unit);
      updateState({ status: 'success', data, error: null });
    } catch (e) {
      const error = e as WeatherError;
      updateState({ status: 'error', error });
    }
  };

  // Effect: Refetch if unit changes and we have data (optional enhancement)
  useEffect(() => {
    if (state.status === 'success' && state.data) {
      // If we had coordinates saved, we could refetch. 
      // For MVP, we'll let the user refresh or rely on the fact that toggle changes state.unit.
      // To keep it simple, we won't auto-refetch here to avoid infinite loops without proper refs.
      // Ideally, store `lastQuery` in state to re-trigger.
      // Let's implement a simple re-fetch if we have the data name (city) or just force user to refresh.
      // BETTER: Just re-trigger based on the last successful method. 
      // For now, let's keep it manual or implemented in the UI "Refresh" button.
    }
  }, [state.unit]);

  return {
    ...state,
    requestLocation,
    searchCity: fetchWeatherByCity,
    setUnit,
    retry: requestLocation, // Simplified retry
  };
};

