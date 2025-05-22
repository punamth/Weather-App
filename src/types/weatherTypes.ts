export interface WeatherData {
  currentConditions: {
    temp: number;
    humidity: number;
    windSpeed: number;
    conditions: string;
  };
  forecast: {
    days: Array<{
      datetime: string;
      tempmax: number;
      tempmin: number;
      conditions: string;
    }>;
  };
}
