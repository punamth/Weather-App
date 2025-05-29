import React, { useEffect, useState } from 'react';

interface WeatherProps {
  location: string;
  useCoords?: boolean;
}

const WeatherCard: React.FC<WeatherProps> = ({ location, useCoords = false }) => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchWeather = async () => {
  setLoading(true);
  try {
    const encodedLocation = useCoords ? location : encodeURIComponent(location);
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodedLocation}?unitGroup=metric&key=${apiKey}&include=hours,current`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();
    setWeatherData(data);
    setError(null);
  } catch (error) {
    console.error('Weather fetch error:', error);
    setError('Could not load weather data.');
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  if (loading) {
    return (
      <div className="text-white mt-4">
        <div className="spinner-border text-light" role="status" />
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger mt-4">{error}</div>;
  }

  if (!weatherData) return null;

  const current = weatherData.currentConditions;
  const next24Hours = weatherData.days[0]?.hours?.slice(0, 24) || [];

  return (
    <div className="container mb-5">
      <div className="card bg-primary text-white mb-4">
        <div className="card-body">
          <h4 className="card-title d-flex justify-content-between align-items-center">
            {weatherData.resolvedAddress}
            <button className="btn btn-light btn-sm" onClick={fetchWeather}>
              Refresh
            </button>
          </h4>
          <h2>{current.temp}°C</h2>
          <p className="mb-1">{current.conditions}</p>
          <small>Wind: {current.windspeed} km/h | Humidity: {current.humidity}%</small>
        </div>
      </div>

      <h5 className="text-white mb-3">Next 24-Hour Forecast</h5>
      <div className="row row-cols-2 row-cols-md-4 g-3">
        {next24Hours.map((hour: any, index: number) => (
          <div className="col" key={index}>
            <div className="card bg-secondary text-white h-100">
              <div className="card-body p-2 text-center">
                <div><strong>{hour.datetime.slice(0, 5)}</strong></div>
                <div>{hour.temp}°C</div>
                <div className="small">{hour.conditions}</div>
                <div className="small">💧 {hour.humidity}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherCard;
