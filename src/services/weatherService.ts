import type { WeatherData } from '../types/weatherTypes';

export const fetchWeather = async (location: string): Promise<WeatherData> => {
  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}?unitGroup=metric&key=${apiKey}&contentType=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    throw error;
  }
};
