import React, { useState } from 'react';

import WeatherCard from './components/WeatherCard';

const App: React.FC = () => {
  const [location, setLocation] = useState('');
  const [query, setQuery] = useState('');
  const [useCoords, setUseCoords] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(true);
  const [locationDenied, setLocationDenied] = useState(false);

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

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = `${position.coords.latitude},${position.coords.longitude}`;
          setQuery(coords);
          setUseCoords(true);
          setShowLocationPrompt(false);
        },
        () => {
          console.warn('Geolocation permission denied or unavailable');
          setLocationDenied(true);
          setShowLocationPrompt(false);
        }
      );
    } else {
      console.warn('Geolocation not supported');
      setLocationDenied(true);
      setShowLocationPrompt(false);
    }
  };

  return (
    <div className="bg-dark text-white min-vh-100 d-flex flex-column align-items-center p-4">
      <h1 className="mb-4">🌤️ Weather Now</h1>

      {/* Show permission prompt if needed */}
      {showLocationPrompt && (
        <div className="alert alert-info text-center" style={{ maxWidth: '500px' }}>
          <p>🌍 Would you like to allow location access to get local weather?</p>
          <button className="btn btn-success me-2" onClick={requestLocation}>
            Yes, use my location
          </button>
          <button className="btn btn-secondary" onClick={() => setShowLocationPrompt(false)}>
            No, I’ll search manually
          </button>
        </div>
      )}

      {/* If user denied location, show notice */}
      {locationDenied && (
        <div className="alert alert-warning text-center" style={{ maxWidth: '500px' }}>
          Location access was denied. Please search manually below.
        </div>
      )}

      {/* If user allowed location, show confirmation */}
      {useCoords && !showLocationPrompt && !locationDenied && (
        <div className="alert alert-success text-center" style={{ maxWidth: '500px' }}>
          Using your current location to show weather updates.
        </div>
      )}

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
