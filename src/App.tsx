import React, { useEffect, useState } from 'react';
import WeatherCard from './components/WeatherCard';

const App: React.FC = () => {
  const [location, setLocation] = useState('');
  const [query, setQuery] = useState('');
  const [useCoords, setUseCoords] = useState(false);

  // Handle "Search" button click or "Enter" key press
  const handleSearch = () => {
    if (location.trim()) {
      setQuery(location);
      setUseCoords(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Use geolocation by default when the app loads
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = `${position.coords.latitude},${position.coords.longitude}`;
          setQuery(coords);
          setUseCoords(true);
        },
        () => {
          console.warn('Geolocation permission denied or unavailable');
        }
      );
    }
  }, []);

  return (
    <div className="bg-dark text-white min-vh-100 d-flex flex-column align-items-center p-4">
      <h1 className="mb-4">🌤️ Weather Now</h1>

      {/* Search input */}
      <div className="input-group mb-4" style={{ maxWidth: '500px' }}>
        <input
          type="text"
          className="form-control"
          placeholder="Enter city name"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Weather card */}
      {query && <WeatherCard location={query} useCoords={useCoords} />}
    </div>
  );
};

export default App;
